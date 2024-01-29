import AbstractClass from 'scripts/methods/abstractClass'

import Events from 'scripts/methods/events'
import Settings from 'scripts/methods/settings'
import RedditPostsController from 'scripts/methods/social/posts/RedditPostsController'
import TelegramPostsController from 'scripts/methods/social/posts/TelegramPostsController'
import TumblrPostsController from 'scripts/methods/social/posts/TumblrPostsController'
import NotificationManager from 'scripts/methods/notificationManager'
import { random } from 'scripts/methods/helpers'
import { DEFAULT_SETTINGS } from 'scripts/methods/constants'

export default class SocialPosts extends AbstractClass {
  /**
   * @param {SocialController} controller
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
  }

  set columnsCount (columnsCount) {
    const allItems = this.items.flat()

    this._columnsCount = columnsCount
    this.items = [ ...new Array(this.columnsCount) ].map(() => [])

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
    this.items = [ ...new Array(this.columnsCount) ].map(() => [])

    Events.trigger('posts:updated')

    return this.items
  }

  init () {
    Events.on('settings:layout.social_mode:update', ({ detail: columnsCount }) => {
      this.columnsCount = columnsCount
    })

    this.columnsCount = Settings.get('layout.social_mode')
  }

  async getAllPosts (reset = false) {
    if (reset) {
      this._resetPosts()
    }

    this.controller.types.forEach(type => {
      try {
        this[type]?.getAllPosts()
      } catch (e) {
        console.error(e)
        NotificationManager.notify(`Не вдалось отримати пости з джерела ${type}`, NotificationManager.TYPE_ERROR)
      }
    })
  }

  /**
   * @param {FormattedPost[]} posts
   */
  appendPosts (posts = []) {
    const divideCount = Math.floor(posts.length / this.columnsCount)

    const columns = [ ...document.getElementsByClassName('social-column') ]
    const heights = columns.map(element => element.offsetHeight)

    this.items.forEach((array, index) => {
      const outOfViewIndex = [ ...columns[index].children ]
        .findIndex(element => element.getBoundingClientRect().top > window.innerHeight)

      if (outOfViewIndex !== -1 && outOfViewIndex !== columns[index].children.length - 1) {
        posts.splice(0, divideCount).forEach(post => {
          if (array.find(({ id }) => id === post.id)) return

          const rand = random(outOfViewIndex, columns[index].children.length)

          array.splice(rand, 0, post)
        })
      } else {
        array.push(...posts.splice(0, divideCount))
      }
    })

    if (heights[0]) {
      const maxHeightColumnLastPost = this.items[heights.indexOf(Math.max(...heights))].pop()

      if (maxHeightColumnLastPost) {
        this.items[heights.indexOf(Math.min(...heights))].push(maxHeightColumnLastPost)
      }
    }

    Events.trigger('posts:updated')
  }

  /**
   * @param {FormattedPost} post
   */
  async getCommentsByPost (post) {
    return this[post.type].getCommentsByPost(post)
  }
}