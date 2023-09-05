import React from 'react'

import ReactMarkdown from 'react-markdown'

import { MEDIA_PHOTO, SOURCE_REDDIT } from 'scripts/methods/social/constants'
import AbstractPostsController from 'scripts/methods/social/posts/AbstractPostsController'
import CacheManager from 'scripts/methods/cache'
import NotificationManager from 'scripts/methods/notificationManager'

export default class RedditPostsController extends AbstractPostsController {
  constructor (controller) {
    super(controller)

    this.type   = SOURCE_REDDIT
    this.url    = process.env.REDDIT_BASE
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
          hidden: post.spoiler,
          type: MEDIA_PHOTO
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
        hidden: post.spoiler,
        type: MEDIA_PHOTO
      }
    })

    return {
      originalPost: post,
      id: post.name,
      type: this.type,
      title: post.title?.trim(),
      text: post.selftext?.trim() && <ReactMarkdown>{ post.selftext.trim() }</ReactMarkdown>,
      media: [ ...mediaImages, ...previewImages ],
      createdAt: new Date(post.created * 1000),
      likes: post.ups,
      url: `${this.url}${post.permalink}`,
      links,
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
        data = await CacheManager.get(`posts/reddit/${source}`, 'json')
      }

      if (!data) {
        ({ data } = await super.get(`/r/${subreddit}/hot.json`, params))

        if (!this.afters[subreddit]) {
          await CacheManager.put(`posts/reddit/${source}`, JSON.stringify(data), this.controller.cacheTTL)
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