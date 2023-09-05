/* global telegram */

import AbstractPostsController from 'scripts/methods/social/posts/AbstractPostsController'

import { MEDIA_PHOTO, MEDIA_VIDEO, SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { TelegramManager } from 'scripts/methods/telegram'

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

          post = { ...groupPost, ...post }

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
        const photoSize = media.photo.sizes.find(({ type }) => type === 'x')

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

  formatPost (post) {
    /** @type {PostLink[]} */
    const links = [
      {
        name: post.postAuthor,
        type: 'user'
      }
    ]

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

    this.afters[source] = posts.at(-1).id

    const groupedPosts = this.groupPosts(posts)
    const formattedPosts = groupedPosts.map(data => this.formatPost(data))

    this.controller.appendPosts(formattedPosts)

    return { posts: groupedPosts, formattedPosts }
  }
}