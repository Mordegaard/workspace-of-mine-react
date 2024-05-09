import AbstractClass from 'scripts/methods/abstractClass'

import Events from 'scripts/methods/events'
import Settings from 'scripts/methods/settings'
import RedditPostsController from 'scripts/methods/social/posts/RedditPostsController'
import TelegramPostsController from 'scripts/methods/social/posts/TelegramPostsController'
import TumblrPostsController from 'scripts/methods/social/posts/TumblrPostsController'
import { random } from 'scripts/methods/helpers'
import { DEFAULT_SETTINGS } from 'scripts/methods/constants'

export default class SocialPosts extends AbstractClass {
  /**
   * @param {SocialControllerInstance} controller
   */
  constructor (controller) {
    super()

    this.controller = controller

    this._columnsCount = DEFAULT_SETTINGS.layout.social_mode
    this.items         = this._resetPosts()

    this.reddit   = new RedditPostsController(this)
    this.telegram = new TelegramPostsController(this)
    this.tumblr   = new TumblrPostsController(this)

    this.cacheTTL = 3600 * 1000 // 1 hour
    this.loading  = false
  }

  set columnsCount (columnsCount) {
    //columnsCount = 1
    const allItems = this.items.flat()

    this._columnsCount = columnsCount
    this.items = Array.range(this.columnsCount).map(() => [])

    allItems.forEach((post, index) => {
      this.items[index % columnsCount].push(post)
    })

    Events.trigger('posts:updated')
  }

  get columnsCount () {
    return this._columnsCount
  }

  /**
   * @private
   */
  _resetPosts () {
    this.items = Array.range(this.columnsCount).map(() => [])

    Events.trigger('posts:updated')

    return this.items
  }

  async init () {
    Events.on('settings:layout.social_mode:update', ({ detail: columnsCount }) => {
      this.columnsCount = columnsCount
    })

    this.columnsCount = Settings.get('layout.social_mode')
  }

  async getAllPosts (reset = false) {
    if (this.loading) return

    this.loading = true

    if (reset) {
      this._resetPosts()
    }

    await Promise.all(
      this.controller.types.map(type => this[type]?.getAllPosts())
    )

    this.loading = false
  }

  /**
   * @param {FormattedPost[]} posts
   */
  appendPosts (posts = []) {
    window.requestAnimationFrame(() => {
      const divideCount = Math.floor(posts.length / this.columnsCount)
      const chunks = posts.chunk(divideCount)

      this.items.forEach((array, index) => {
        const outOfViewIndex = array
          .findIndex(post => document.getElementById(this.getPostId(post))?.getBoundingClientRect().top > window.innerHeight)

        if (outOfViewIndex !== -1) {
          chunks[index].forEach(post => {
            const rand = random(outOfViewIndex, array.length)

            array.splice(rand, 0, post)
          })
        } else {
          array.push(...chunks[index])
        }
      })

      Events.trigger('posts:updated')
    })
  }

  /**
   * @param {FormattedPost} post
   */
  async getCommentsByPost (post) {
    return this[post.type].getCommentsByPost(post)
  }

  /**
   * @param {FormattedPost} post
   * @return {string}
   */
  getPostId (post) {
    return `${post.type}_${post.id}`
  }
}