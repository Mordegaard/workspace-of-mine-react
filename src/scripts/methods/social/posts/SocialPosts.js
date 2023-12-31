import AbstractClass from 'scripts/methods/abstractClass'

import RedditPostsController from 'scripts/methods/social/posts/RedditPostsController'
import TelegramPostsController from 'scripts/methods/social/posts/TelegramPostsController'
import TumblrPostsController from 'scripts/methods/social/posts/TumblrPostsController'
import Events from 'scripts/methods/events'
import { random } from 'scripts/methods/helpers'
import NotificationManager from 'scripts/methods/notificationManager'
import { Settings } from 'scripts/methods/storage'
import { THREE_COLUMNS_MODE } from 'scripts/methods/constants'

export default class SocialPosts extends AbstractClass {
  /**
   * @param {SocialController} controller
   */
  constructor (controller) {
    super()

    this.controller = controller

    this._columnsCount = null
    this.items        = this._resetPosts()

    this.reddit   = new RedditPostsController(this)
    this.telegram = new TelegramPostsController(this)
    this.tumblr   = new TumblrPostsController(this)

    this.cacheTTL = 3600 * 1000 // 1 hour

    this._init()
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

  _init () {
    Events.on('settings:social_layout_mode:update', ({ detail: columnsCount }) => {
      this.columnsCount = columnsCount
    })

    Settings.get('social_layout_mode', THREE_COLUMNS_MODE).then(columnsCount => this.columnsCount = columnsCount)
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