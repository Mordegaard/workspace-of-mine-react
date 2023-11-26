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
    })

    posts.forEach(post => {
      if (post.groupedId) {
        const sameGroupPosts = posts.filter(
          groupPost => post !== groupPost && post.groupedId.toString() === groupPost.groupedId?.toString()
        )

        const media = post.media

        post = additiveMergeObjects(post, ...sameGroupPosts)

        sameGroupPosts.forEach(groupPost => {
          if (media && groupPost.media) {
            post.media = [ ...groupPost.media, ...media ]
          }

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

    if (!Array.isArray(post.media)) {
      post.media = [post.media]
    }

    return post.media.map(media => {
      let data = media
      let width
      let height
      let type

      const photo = media.photo ?? media.webpage?.photo

      switch (true) {
        case Boolean(photo): {
          const photoSize = photo.sizes.find(({ type }) => type === 'x') ?? photo.sizes[0]

          width = photoSize.w
          height = photoSize.h
          type = MEDIA_PHOTO

          break
        }
        case media.document?.mimeType?.includes(MEDIA_VIDEO): {
          const attributes = media.document.attributes.find(({ className }) => className === 'DocumentAttributeVideo')

          width = attributes.w
          height = attributes.h
          type = MEDIA_VIDEO

          break
        }
      }

      return {
        data,
        width,
        height,
        type,
        hidden: media.spoiler ?? false
      }
    }).filter(({ type }) => type)
  }

  getReactions (post) {
    return post.reactions?.results.map(({ count, reaction }) => ({
      count,
      emoji: reaction.emoticon
    }))
  }

  formatPost (post, source) {
    /** @type {PostLink[]} */
    const links = [
      {
        name: source.name,
        type: 'source',
        url: source.url
      },
    ]

    if (post.postAuthor) {
      links.push({
        name: post.postAuthor,
        type: 'user'
      })
    }

    return {
      originalPost: post,
      id: post.id,
      type: this.type,
      title: post.message || 'Без заголовку',
      createdAt: new Date(post.date * 1000),
      media: this.getMedia(post),
      source: source,
      comments: post.replies?.replies ?? 0,
      reactions: this.getReactions(post),
      links
    }
  }

  async getPostsBySource (sourceKey, options) {
    const params = {
      peer: sourceKey,
      limit: await this.getPerPage(),
      offsetId: this.afters[sourceKey],
      ...options,
    }

    const { messages: posts } = await TelegramManager.client.invoke(
      new telegram.Api.messages.GetHistory(params)
    )

    const source = await this.getSource(sourceKey)

    this.afters[sourceKey] = posts.at(-1).id

    const groupedPosts = this.groupPosts(posts)
    const formattedPosts = groupedPosts.map(data => this.formatPost(data, source))

    this.controller.appendPosts(formattedPosts)

    return { posts: groupedPosts, formattedPosts }
  }

  formatComment (comment, post) {
    return {
      id: comment.id,
      type: SOURCE_TELEGRAM,
      text: <p>{ comment.message || 'Без тексту' }</p>,
      createdAt: new Date(comment.date * 1000),
      author: comment.author?.firstName ?? comment.author?.title ?? post.source.name,
      replyTo: comment.replyTo?.replyToMsgId,
      media: this.getMedia(comment),
      reactions: this.getReactions(comment),
      originalComment: comment
    }
  }

  async getCommentsByPost (post) {
    const params = {
      peer: post.source.key,
      msgId: post.id,
      limit: Math.min(post.comments, 100)
    }

    const { messages } = await TelegramManager.client.invoke(
      new telegram.Api.messages.GetReplies(params)
    )

    const userIds = messages.map(({ fromId }) => fromId?.userId).filter(Boolean)
    const channelIds = messages.map(({ fromId }) => fromId?.channelId).filter(Boolean)

    const users = await TelegramManager.client.invoke(
      new telegram.Api.users.GetUsers({
        id: userIds
      })
    )

    const { chats } = await TelegramManager.client.invoke(
      new telegram.Api.channels.GetChannels({
        id: channelIds
      })
    )

    const authors = [ ...users, ...chats ]

    messages.forEach(message => {
      message.author = authors.find(({ id }) =>
        String(id) === String(message.fromId?.userId ?? message.fromId?.channelId)
      )
    })

    return messages.map(comment => this.formatComment(comment, post))
  }
}