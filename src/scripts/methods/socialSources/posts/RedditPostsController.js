import React from 'react'

import ReactMarkdown from 'react-markdown'

import { SOURCE_REDDIT } from 'scripts/methods/socialSources/constants'
import AbstractPostsController from 'scripts/methods/socialSources/posts/AbstractPostsController'
import CacheController from 'scripts/methods/cache'
import NotificationManager from 'scripts/methods/notificationManager'

export default class RedditPostsController extends AbstractPostsController {
  constructor (controller) {
    super(controller)

    this.type = SOURCE_REDDIT
    this.url = 'https://www.reddit.com'
    this.afters = {}
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
      type: this.type,
      title: post.title.trim(),
      text: <ReactMarkdown>{ post.selftext.trim() }</ReactMarkdown>,
      images: [ ...mediaImages, ...previewImages ],
      createdAt: new Date(post.created * 1000),
      likes: post.ups,
      url: `${this.url}${post.permalink}`,
      originalPost: post,
    }
  }

  async getPostsBySource (source, options = {}) {
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
}