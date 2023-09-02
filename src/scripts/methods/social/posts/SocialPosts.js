import AbstractClass from 'scripts/methods/abstractClass'

import RedditPostsController from 'scripts/methods/social/posts/RedditPostsController'
import TelegramPostsController from 'scripts/methods/social/posts/TelegramPostsController'
import Events from 'scripts/methods/events'

export default class SocialPosts extends AbstractClass {
  constructor (controller) {
    super()

    this.controller = controller

    this.columnsCount = 3
    this.items        = this._resetPosts()

    this.reddit   = new RedditPostsController(this)
    this.telegram = new TelegramPostsController(this)
  }

  /**
   * @private
   */
  _resetPosts () {
    this.items = [ ...new Array(this.columnsCount) ].map(() => [])

    Events.trigger('posts:updated')

    return this.items
  }

  async getAllPosts (reset = false) {
    if (reset) {
      this._resetPosts()
    }

    this.controller.types.forEach(type => {
      this[type]?.getAllPosts()
    })
  }

  /**
   * @param {FormattedPost[]} posts
   */
  appendPosts (posts = []) {
    const divideCount = Math.floor(posts.length / this.columnsCount)

    this.items.forEach(array => {
      array.push(...posts.splice(0, divideCount))
    })

    const heights = [ ...document.getElementsByClassName('social-column') ]
      .map(element => element.offsetHeight)

    if (heights[0]) {
      const maxHeightColumnLastPost = this.items[heights.indexOf(Math.max(...heights))].pop()

      if (maxHeightColumnLastPost) {
        this.items[heights.indexOf(Math.min(...heights))].push(maxHeightColumnLastPost)
      }
    }

    Events.trigger('posts:updated')
  }
}