/* global telegram */

import React from 'react'

import AbstractPostsController from 'scripts/methods/social/posts/AbstractPostsController'

import { MEDIA_IMAGE, MEDIA_VIDEO, SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { TelegramManager } from 'scripts/methods/telegram'
import { additiveMergeObjects } from 'scripts/methods/helpers'
import { CustomEmoji } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem/CustomEmoji'
import CacheManager from 'scripts/methods/cache'

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
          type = MEDIA_IMAGE

          break
        }
        case media.document?.mimeType?.includes(MEDIA_IMAGE): {
          const attributes = media.document.attributes.find(({ className }) => className === 'DocumentAttributeImageSize')

          width = attributes.w
          height = attributes.h
          type = MEDIA_IMAGE

          break
        }
        case media.document?.mimeType?.includes(MEDIA_VIDEO): {
          const attributes = media.document.attributes.find(({ className }) => className === 'DocumentAttributeVideo')

          if (!(media.document instanceof telegram.Api.Document)) {
            const strippedThumbIndex = media.document.thumbs.findIndex(({ className }) => className === 'PhotoStrippedSize')

            media.document.thumbs[strippedThumbIndex].bytes = TelegramManager.helpers.arrayToBuffer(media.document.thumbs[strippedThumbIndex].bytes.data)
            media.document.fileReference = TelegramManager.helpers.arrayToBuffer(media.document.fileReference.data)
            media.document.thumbs[strippedThumbIndex] = new telegram.Api.PhotoStrippedSize(media.document.thumbs[strippedThumbIndex])
            media.document = new telegram.Api.Document(media.document)
          }

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

  async getReactions (post) {
    if (!Array.isArray(post.reactions?.results)) {
      return null
    }

    const customReactions = post.reactions.results.filter(({ reaction }) => reaction.documentId)
    const customReactionDocuments = await TelegramManager.getCustomEmojis(
      customReactions.map(({ reaction }) => reaction.documentId)
    )

    return post.reactions.results.map(({ count, reaction, chosenOrder }) => ({
      count,
      selected: chosenOrder != null,
      emoji: reaction.documentId
        ? <CustomEmoji
            document={customReactionDocuments.find(document => String(document.id) === String(reaction.documentId))}
            originalEmoji={reaction.emoticon + '\uFE0F'}
          />
        : reaction.emoticon + '\uFE0F'
    }))
  }

  async formatPost (post, source) {
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
      reactions: await this.getReactions(post),
      links
    }
  }

  async getPostsBySource (sourceKey, options) {
    let posts

    if (this.afters[sourceKey] == null) {
      posts = await CacheManager.get(`posts/telegram/${sourceKey}`, 'json')
    }

    if (!posts) {
      const params = {
        peer: sourceKey,
        limit: await this.getPerPage(),
        offsetId: this.afters[sourceKey],
        ...options,
      }

      ;({ messages: posts } = await TelegramManager.client.invoke(
        new telegram.Api.messages.GetHistory(params)
      ))

      if (this.afters[sourceKey] == null) {
        await CacheManager.put(`posts/telegram/${sourceKey}`, JSON.stringify(posts))
      }
    }

    const source = await this.getSource(sourceKey)

    this.afters[sourceKey] = posts.at(-1).id

    const groupedPosts = this.groupPosts(posts)
    const formattedPosts = await Promise.all(groupedPosts.map(data => this.formatPost(data, source)))

    this.controller.appendPosts(formattedPosts)

    return { posts: groupedPosts, formattedPosts }
  }

  async formatComment (comment, post) {
    return {
      id: comment.id,
      type: SOURCE_TELEGRAM,
      text: <p>{ comment.message || 'Без тексту' }</p>,
      createdAt: new Date(comment.date * 1000),
      author: comment.author?.firstName ?? comment.author?.title ?? post.source.name,
      replyTo: comment.replyTo?.replyToMsgId,
      media: this.getMedia(comment),
      reactions: await this.getReactions(comment),
      originalPost: comment
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

    return (await Promise.all(messages.map(comment => this.formatComment(comment, post))))
      .sort((a, b) => a.createdAt - b.createdAt)
  }
}