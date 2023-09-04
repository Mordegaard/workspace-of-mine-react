/* global telegram */

import AbstractPostsController from 'scripts/methods/social/posts/AbstractPostsController'

import { SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { TelegramManager } from 'scripts/methods/telegram'
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
      if (post.media?.photo) {
        post.media.photo = [post.media.photo]
      }

      if (post.groupedId) {
        const sameGroupPosts = posts.filter(
          groupPost => post !== groupPost && post.groupedId.toString() === groupPost.groupedId?.toString()
        )

        sameGroupPosts.forEach(groupPost => {
          if (post.media?.photo && groupPost.media?.photo) {
            post.media.photo.push(groupPost.media.photo)
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
   * @return {PostImage[]}
   */
  getImages (post) {
    if (post?.media?.photo == null) return []

    return post.media.photo.map(photo => {
      const imageUrl  = photo?.webpage?.displayUrl ?? photo
      const photoSize = photo.sizes.find(({ type }) => type === 'x')

      return {
        url: imageUrl,
        width: photoSize.w,
        height: photoSize.h,
        hidden: post.media.spoiler
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
      images: this.getImages(post),
      links,
      reactions
    }
  }

  async getPostsBySource (source, options) {
    let posts

    if (!this.afters[source]) {
      posts = await CacheManager.get(`posts/telegram/${source}`, 'json')
    }

    if (!posts) {
      const params = {
          peer: source,
          limit: this.perPage,
          offsetId: this.afters[source],
          ...options,
        }

      ;({ messages: posts } = await TelegramManager.client.invoke(
        new telegram.Api.messages.GetHistory(params)
      ))

      if (!this.afters[source]) {
        await CacheManager.put(`posts/telegram/${source}`, JSON.stringify(posts), this.controller.cacheTTL)
      }
    }

    this.afters[source] = posts.at(-1).id

    const groupedPosts = this.groupPosts(posts)
    const formattedPosts = groupedPosts.map(data => this.formatPost(data))

    this.controller.appendPosts(formattedPosts)

    return { posts: groupedPosts, formattedPosts }
  }
}