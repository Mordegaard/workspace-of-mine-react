/* global telegram */

import AbstractPostsController from 'scripts/methods/social/posts/AbstractPostsController'

import { SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { TelegramController } from 'scripts/methods/telegram'
import CacheManager from 'scripts/methods/cache'

export default class TelegramPostsController extends AbstractPostsController {
  constructor (controller) {
    super(controller)

    this.type   = SOURCE_TELEGRAM
    this.url    = process.env.TELEGRAM_BASE
    this.afters = {}
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
      id: post.id,
      type: this.type,
      title: post.message || 'Без заголовку',
      createdAt: new Date(post.date * 1000),
      images: [],
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

      ;({ messages: posts } = await TelegramController.client.invoke(
        new telegram.Api.messages.GetHistory(params)
      ))

      if (!this.afters[source]) {
        await CacheManager.put(`posts/telegram/${source}`, JSON.stringify(posts), this.cacheTTL)
      }
    }

    this.afters[source] = posts.at(-1).id

    const formattedPosts = posts.map(data => this.formatPost(data))

    this.controller.appendPosts(formattedPosts)

    console.log(posts, formattedPosts)

    return { posts, formattedPosts }
  }
}