import React from 'react'

import ReactMarkdown from 'react-markdown'

import AbstractFetch from 'scripts/methods/socialSources/AbstractFetch'
import SocialSourcesController, { SOURCE_REDDIT } from 'scripts/methods/socialSources/index'
import NotificationManager from 'scripts/methods/notificationManager'
import CacheController from 'scripts/methods/cache'

export default class RedditService extends AbstractFetch {
  constructor (controller) {
    super(controller)

    this.url = 'https://www.reddit.com'
    this.afters = {}
    this.perPage = 15
  }

  /**
   * @param {object} post
   * @return {FormattedPost}
   */
  formatPost (post) {
    const links = [
      {
        url: `${this.url}/u/${post.author}`,
        name: post.author,
        type: 'user'
      },
      {
        url: `${this.url}/${post.subreddit_name_prefixed}`,
        name: post.subreddit_name_prefixed,
        type: 'source'
      }
    ]

    const mediaImages = Object.values(post.media_metadata ?? {})
      .map(image => {
        let size = 6

        while (image.p[size] == null && size > 0) {
          --size
        }

        return {
          url: image.p[size - 2 < 0 ? 0 : size - 2].u.replaceAll('&amp;', '&'),
          fullSizeUrl: image.p[size].u.replaceAll('&amp;', '&'),
          width: image.p[size].x,
          height: image.p[size].y,
          hidden: post.spoiler
        }
      })

    const previewImages = (post?.preview?.images ?? []).map(image => {
      const { resolutions, source } = image

      let size = 4

      while (resolutions[size] == null && size) {
        size--
      }

      return {
        url: resolutions[size].url.replaceAll('&amp;', '&'),
        fullSizeUrl: source.url.replaceAll('&amp;', '&'),
        width: source.width,
        height: source.height,
        hidden: post.spoiler
      }
    })

    return {
      links,
      id: post.name,
      images: [ ...mediaImages, ...previewImages ],
      title: post.title.trim(),
      text: <ReactMarkdown>{ post.selftext.trim() }</ReactMarkdown>,
      createdAt: new Date(post.created * 1000),
      likes: post.ups,
      url: `${this.url}${post.permalink}`,
      type: SOURCE_REDDIT,
      originalPost: post,
    }
  }

  async getPosts (source, options = {}) {
    try {
      let data
      const subreddit = source.replace('r/', '')

      const params = {
        limit: this.perPage,
        ...options
      }

      if (this.afters[subreddit]) {
        params.after = this.afters[subreddit]
      } else {
        data = await CacheController.get(source, 'json')
      }

      if (!data) {
        ({ data } = await super.get(`/r/${subreddit}/hot.json`, params))

        if (!this.afters[subreddit]) {
          await CacheController.put(source, JSON.stringify(data), this.cacheTTL)
        }
      }

      const { children, after } = data

      this.afters[subreddit] = after

      const posts = children.map(({ data }) => data).filter(data => !data.stickied)
      const formattedPosts = posts.map(data => this.formatPost(data))

      this.controller.appendPosts(formattedPosts)

      return { posts, formattedPosts }
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Помилка при отриманні постів з субреддіта ${source}`, NotificationManager.TYPE_ERROR)
    }
  }

  async getAllPosts () {
    const sources = await SocialSourcesController.get()
    const keys = sources
      .filter(({ hidden }) => !hidden)
      .map(({ key }) => key)

    const promises = keys.map(key => this.getPosts(key))

    return Promise.all(promises)
  }

  getAbout (source, options ={}) {
    return super.get(`/r/${source}/about.json`, options)
  }
}
