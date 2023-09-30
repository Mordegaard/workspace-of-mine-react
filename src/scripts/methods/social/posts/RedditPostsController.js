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

  formatPost (post, sourceObject) {
    /** @type {PostLink[]} links */
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
          thumbnail: post.thumbnail.replaceAll('&amp;', '&'),
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
        thumbnail: post.thumbnail.replaceAll('&amp;', '&'),
        width: source.width,
        height: source.height,
        hidden: post.spoiler,
        type: MEDIA_PHOTO
      }
    })

    return {
      originalPost: post,
      id: post.id,
      type: this.type,
      title: post.title?.trim(),
      text: post.selftext?.trim() ? <ReactMarkdown>{ post.selftext.trim() }</ReactMarkdown> : null,
      media: [ ...mediaImages, ...previewImages ],
      createdAt: new Date(post.created * 1000),
      likes: post.ups,
      comments: post.num_comments ?? 0,
      url: `${this.url}${post.permalink}`,
      source: sourceObject,
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
      const sourceObject = await this.getSource(source)

      this.afters[subreddit] = after

      const posts = children.map(({ data }) => data).filter(data => !data.stickied)
      const formattedPosts = posts.map(data => this.formatPost(data, sourceObject))

      this.controller.appendPosts(formattedPosts)

      return { posts, formattedPosts }
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Помилка при отриманні постів з субреддіта ${source}`, NotificationManager.TYPE_ERROR)
    }
  }

  formatComment (comment) {
    return {
      id: comment.id,
      text: <ReactMarkdown>
        { comment.body?.trim().replaceAll('&amp;', '&') || 'Без тексту' }
      </ReactMarkdown>,
      createdAt: new Date(comment.created * 1000),
      author: comment.author,
      replyTo: comment.parent_id?.split('_')[1],
      originalComment: comment
    }
  }

  async getCommentsByPost (post) {
    const [ originalPost, comments ] = await super.get(`/${post.source.key}/comments/${post.id}.json`)
    const { children } = comments.data

    const result = children.map(({ data }) => this.formatComment(data))

    children.forEach(({ data }) => {
      result.push(...this.iterateReplies(data))
    })

    return result.sort((a, b) => a.createdAt - b.createdAt)
  }

  iterateReplies (comment) {
    const result = []

    if (comment.replies) {
      comment.replies.data.children.forEach(({ data }) => {
        result.push(this.formatComment(data))
        result.push(...this.iterateReplies(data))
      })
    }

    return result
  }
}