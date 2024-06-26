import React from 'react'

import ReactMarkdown from 'react-markdown'

import { MEDIA_EMBED, MEDIA_IMAGE, REDDIT_BASE, SOURCE_REDDIT } from 'scripts/methods/social/constants'
import AbstractPostsController from 'scripts/methods/social/posts/AbstractPostsController'
import CacheManager from 'scripts/methods/cache'
import NotificationManager from 'scripts/methods/notificationManager'
import { sanitize } from 'scripts/methods/helpers'

export default class RedditPostsController extends AbstractPostsController {
  constructor (controller) {
    super(controller)

    this.type   = SOURCE_REDDIT
    this.url    = REDDIT_BASE
    this.afters = {}
    this.defaultOptions = {
      raw_json: 1
    }
  }

  getMediaEmbed (post) {
    if (!post.media?.oembed) return null

    const html = sanitize(post.media.oembed.html)

    const wrapper = document.createElement('div')

    wrapper.innerHTML = html

    const [ iframe ] = wrapper.getElementsByTagName('iframe')

    if (!iframe) return null

    return {
      type: MEDIA_EMBED,
      width: post.media.oembed.width,
      height: post.media.oembed.height,
      data: {
        url: iframe.getAttribute('src'),
        thumbnail: sanitize(post.media.oembed.thumbnail_url)
      }
    }
  }

  getMedia (post) {
    const mediaImages = (post.gallery_data?.items ?? [])
      .map(({ media_id }) => post.media_metadata[media_id])
      .map(image => {
        let size = 6
        let url, thumbnail, width, height

        if (image.m.includes('gif')) {
          url = sanitize(image.s.gif)
          thumbnail = sanitize(image.s.gif)
          width = image.s.x
          height = image.s.y
        } else {
          while (image.p[size] == null && size > 0) {
            --size
          }

          url = sanitize(image.p[size].u)
          thumbnail = sanitize(image.p[size - 2 < 0 ? 0 : size - 2].u)
          width = image.p[size].x
          height = image.p[size].y
        }

        return {
          data: {
            url,
            thumbnail,
          },
          width,
          height,
          hidden: post.spoiler,
          type: MEDIA_IMAGE
        }
      })

    const previewImages = (post?.preview?.images ?? []).map(image => {
      const imageObject = image.variants?.gif ?? image
      const { resolutions, source } = imageObject

      let size = 4

      while (resolutions[size] == null && size) {
        size--
      }

      return {
        data: {
          url: sanitize(source.url),
          thumbnail: sanitize(resolutions[size].url),
        },
        width: source.width,
        height: source.height,
        hidden: post.spoiler,
        type: MEDIA_IMAGE
      }
    })

    return [ ...mediaImages, ...previewImages, this.getMediaEmbed(post) ].filter(Boolean)
  }

  async formatPost (post, source) {
    /** @type {PostLink[]} links */
    const links = [
      {
        url: `${this.url}u/${post.author}`,
        name: post.author,
        type: 'user'
      },
      {
        url: source.url,
        name: post.subreddit_name_prefixed,
        type: 'source'
      }
    ]

    return {
      originalPost: post,
      id: post.id,
      type: this.type,
      title: post.title?.trim(),
      text: post.selftext?.trim() ? <ReactMarkdown>{ post.selftext.trim() }</ReactMarkdown> : null,
      media: this.getMedia(post),
      createdAt: new Date(post.created * 1000),
      likes: post.ups,
      comments: post.num_comments ?? 0,
      url: `${this.url}${post.permalink.replace('/r/', 'r/')}`,
      source: source,
      links,
    }
  }

  async getPostsBySource (sourceKey, options = {}) {
    try {
      let data
      const subreddit = sourceKey.replace('r/', '')

      const params = {
        limit: await this.getPerPage(),
        ...options
      }

      if (this.afters[subreddit]) {
        params.after = this.afters[subreddit]
      } else {
        data = await CacheManager.get(`posts/${this.type}/${sourceKey}`, CacheManager.TYPE_JSON)
      }

      if (!data) {
        ({ data } = await super.get(`r/${subreddit}/hot.json`, params))

        if (!this.afters[subreddit]) {
          await CacheManager.put(`posts/${this.type}/${sourceKey}`, data, this.controller.cacheTTL)
        }
      }

      const { children, after } = data
      const source = await this.getSource(sourceKey)

      this.afters[subreddit] = after

      const posts = children.map(({ data }) => data).filter(data => !data.stickied)
      const formattedPosts = await Promise.all(posts.map(data => this.formatPost(data, source)))

      this.controller.appendPosts(formattedPosts)

      return { posts, formattedPosts }
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Помилка при отриманні постів з субреддіта ${sourceKey}`, NotificationManager.TYPE_ERROR)
    }
  }

  async getPostsById (ids = [], source) {
    try {
      let posts = []
      const uncachedIds = ids.slice()

      for (const id of ids) {
        const post = await CacheManager.get(`posts/show_many/${this.type}/${id}`, CacheManager.TYPE_JSON)

        if (post) {
          posts.push(post)
          uncachedIds.splice(uncachedIds.indexOf(id), 1)
        }
      }

      if (uncachedIds.length > 0) {
        const { data } = await super.get(`api/info.json?id=${uncachedIds.map(id => `t3_${id}`).join(',')}`)
        const fetchedPosts = data.children.map(({ data }) => data)

        for (const post of fetchedPosts) {
          await CacheManager.put(`posts/show_many/${this.type}/${post.id}`, post, this.controller.cacheTTL)
        }

        posts.push(...fetchedPosts)
      }

      const formattedPosts = await Promise.all(
        posts.map(data => this.formatPost(data, source))
      )

      return formattedPosts
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Помилка при отриманні постів`, NotificationManager.TYPE_ERROR)
    }
  }

  // eslint-disable-next-line no-unused-vars
  async formatComment (comment, post) {
    return {
      id: comment.id,
      type: SOURCE_REDDIT,
      text: <ReactMarkdown>
        { sanitize(comment.body) || 'Без тексту' }
      </ReactMarkdown>,
      createdAt: new Date(comment.created * 1000),
      author: comment.author,
      replyTo: comment.parent_id?.split('_')[1],
      likes: comment.ups,
      originalPost: comment
    }
  }

  async getCommentsByPost (post) {
    // eslint-disable-next-line no-unused-vars
    const [ originalPost, comments ] = await super.get(`${post.source.key}/comments/${post.id}.json`)
    const { children } = comments.data

    const result = await Promise.all(children.map(({ data }) => this.formatComment(data, post)))

    for (const { data } of children) {
      result.push(...(await this.iterateReplies(data)))
    }

    return result
      .filter(({ createdAt }) => isNaN(createdAt) === false)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  async iterateReplies (comment) {
    const result = []

    if (comment.replies) {
      for (const { data } of comment.replies.data.children) {
        result.push(await this.formatComment(data))
        result.push(...(await this.iterateReplies(data)))
      }
    }

    return result
  }
}