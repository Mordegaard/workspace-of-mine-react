/* global telegram */

import React from 'react'

import AbstractPostsController from 'scripts/methods/social/posts/AbstractPostsController'

import { MEDIA_PHOTO, MEDIA_VIDEO, SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { TelegramManager } from 'scripts/methods/telegram'
import { additiveMergeObjects } from 'scripts/methods/helpers'

export default class TelegramPostsController extends AbstractPostsController {
  constructor (controller) {
    super(controller)

    this.type   = SOURCE_TELEGRAM
    this.url    = process.env.TELEGRAM_BASE
    this.afters = {}
  }

  /**
   * @param {Object[]} posts
   */
  groupPosts (posts = []) {
    const groupedPosts = []

    posts.forEach(post => {
      if (post.media) {
        post.media = [post.media]
      }

      if (post.groupedId) {
        const sameGroupPosts = posts.filter(
          groupPost => post !== groupPost && post.groupedId.toString() === groupPost.groupedId?.toString()
        )

        sameGroupPosts.forEach(groupPost => {
          if (post.media && groupPost.media) {
            post.media.push(groupPost.media)
          }

          post = additiveMergeObjects(groupPost, post)

          delete posts[posts.indexOf(groupPost)]
        })
      }

      groupedPosts.push(post)
    })

    return groupedPosts
  }

  /**
   * @param post
   * @return {PostMedia[]}
   */
  getMedia (post) {
    if (post.media == null) return []

    return post.media.map(media => {
      let url = media
      let width
      let height
      let type

      if (media.photo) {
        const photoSize = media.photo.sizes.find(({ type }) => type === 'x') ?? media.photo.sizes[0]

        width = photoSize.w
        height = photoSize.h
        type = MEDIA_PHOTO
      } else if (media.document?.mimeType?.includes(MEDIA_VIDEO)) {
        const attributes = media.document.attributes.find(({ className }) => className === 'DocumentAttributeVideo')

        width = attributes.w
        height = attributes.h
        type = MEDIA_VIDEO
      }

      return {
        url,
        width,
        height,
        type,
        fullSizeUrl: media.photo?.webpage?.displayUrl,
        hidden: post.media.spoiler ?? false
      }
    })
  }

  formatPost (post, sourceObject) {
    /** @type {PostLink[]} */
    const links = [
      {
        name: sourceObject.name,
        type: 'source',
        url: `${this.url}/${sourceObject.key}`
      },
    ]

    if (post.postAuthor) {
      links.push({
        name: post.postAuthor,
        type: 'user'
      })
    }

    const reactions = post.reactions?.results.map(({ count, reaction }) => ({
      count,
      emoji: reaction.emoticon
    }))

    return {
      originalPost: post,
      id: post.id,
      type: this.type,
      title: post.message || 'Без заголовку',
      createdAt: new Date(post.date * 1000),
      media: this.getMedia(post),
      source: sourceObject,
      comments: post.replies?.replies ?? 0,
      links,
      reactions
    }
  }

  async getPostsBySource (source, options) {
    const params = {
        peer: source,
        limit: this.perPage,
        offsetId: this.afters[source],
        ...options,
      }

    const { messages: posts } = await TelegramManager.client.invoke(
      new telegram.Api.messages.GetHistory(params)
    )

    const sourceObject = await this.getSource(source)

    this.afters[source] = posts.at(-1).id

    const groupedPosts = this.groupPosts(posts)
    const formattedPosts = groupedPosts.map(data => this.formatPost(data, sourceObject))

    this.controller.appendPosts(formattedPosts)

    return { posts: groupedPosts, formattedPosts }
  }

  formatComment (comment) {
    return {
      id: comment.id,
      text: <p>{ comment.message || 'Без тексту' }</p>,
      createdAt: new Date(comment.date * 1000),
      author: comment.author.firstName,
      replyTo: comment.replyTo?.replyToMsgId,
      originalComment: comment
    }
  }

  async getCommentsByPost (post) {
    const params = {
      peer: post.source.key,
      msgId: post.id,
      limit: 100
    }

    const { messages } = await TelegramManager.client.invoke(
      new telegram.Api.messages.GetReplies(params)
    )

    const users = await TelegramManager.client.invoke(
      new telegram.Api.users.GetUsers({
        id: messages.map(({ fromId }) => fromId.userId)
      })
    )

    messages.forEach(message => {
      message.author = users.find(({ id }) => String(id) === String(message.fromId.userId))
    })

    return messages.map(comment => this.formatComment(comment))
  }
}