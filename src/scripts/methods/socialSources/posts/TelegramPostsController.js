/* global telegram */

import AbstractPostsController from 'scripts/methods/socialSources/posts/AbstractPostsController'

import { SOURCE_TELEGRAM } from 'scripts/methods/socialSources/constants'
import { TelegramController } from 'scripts/methods/telegram'

export default class TelegramPostsController extends AbstractPostsController {
  constructor (controller) {
    super(controller)

    this.url = 'https://t.me'
    this.type = SOURCE_TELEGRAM
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

    const reactions = post.reactions.results.map(({ count, reaction }) => ({
      count,
      emoji: reaction.emoticon
    }))

    return {
      id: post.id,
      type: this.type,
      title: post.message ?? 'Без заголовку',
      createdAt: new Date(post.date * 1000),
      images: [],
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

    const { messages: posts } = await TelegramController.client.invoke(
      new telegram.Api.messages.GetHistory(params)
    )

    this.afters[source] = posts.at(-1).id

    const formattedPosts = posts.map(data => this.formatPost(data))

    this.controller.appendPosts(formattedPosts)

    console.log(posts, formattedPosts)

    return { posts, formattedPosts }
  }
}