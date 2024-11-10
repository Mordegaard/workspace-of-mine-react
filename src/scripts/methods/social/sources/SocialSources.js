import AbstractClass from 'scripts/methods/abstractClass'

import Events from 'scripts/methods/events'
import SocialSourceValidator from 'scripts/methods/social/SocialSourceValidator'
import { SocialSourcesStorage as SocialSourcesStorage } from 'scripts/methods/storage'
import NotificationManager from 'scripts/methods/notificationManager'
import RedditSourcesController from 'scripts/methods/social/sources/Reddit/RedditSourcesController'
import TelegramSourcesController from 'scripts/methods/social/sources/Telegram/TelegramSourcesController'
import TumblrSourcesController from 'scripts/methods/social/sources/Tumblr/TumblrSourcesController'
import BlueskySourcesController from 'scripts/methods/social/sources/Bluesky/BlueskySourcesController'
import { SOURCE_BLUESKY, SOURCE_REDDIT, SOURCE_TELEGRAM, SOURCE_TUMBLR } from 'scripts/methods/social/constants'

/**
 * @class SocialSources
 * @property {AbstractSource[]} items
 * @property {SocialControllerInstance} controller
 */
export default class SocialSources extends AbstractClass {
  constructor (controller) {
    super()

    this.validator  = SocialSourceValidator
    this.controller = controller

    this[SOURCE_REDDIT]   = new RedditSourcesController(this)
    this[SOURCE_TELEGRAM] = new TelegramSourcesController(this)
    this[SOURCE_TUMBLR]   = new TumblrSourcesController(this)
    this[SOURCE_BLUESKY]  = new BlueskySourcesController(this)

    this.items = []
  }

  async init () {
    this.items = (await SocialSourcesStorage.get('items', [])).map(source => this[source.type]?.parse(source) ?? {})

    return Promise.all([
      this[SOURCE_REDDIT].init(),
      this[SOURCE_TELEGRAM].init(),
      this[SOURCE_TUMBLR].init(),
      this[SOURCE_BLUESKY].init(),
    ])
  }

  /**
   * @param {AbstractSource[]} sources
   * @param {boolean} fetch
   */
  async updateAll (sources, fetch = false) {
    await SocialSourcesStorage.set('items', JSON.parse(JSON.stringify(sources)))

    this.items = [ ...sources ]

    Events.trigger('sources:updated', this.items)

    if (fetch) {
      this.controller.posts.getAllPosts(true)
    }
  }

  /**
   * @param {?string} [key]
   * @return {Promise<AbstractSource[]|AbstractSource>}
   */
  async get (key = null) {
    return key ? this.items.find(source => key === source.key) : this.items
  }

  /**
   * @param {string} key
   * @param {AbstractSource} type
   * @return {Promise<boolean>}
   */
  async put (key, type) {
    const sources = await this.get()

    if (!this.validator.validate({ key, type, sources })) {
      NotificationManager.notify(Object.values(this.validator.errors).join('\n'), NotificationManager.TYPE_INFO)
      return false
    }

    try {
      const source = await this[type].find(key)

      if (source == null) {
        return false
      }

      sources.push(source)

      await this.updateAll(sources, true)

      return true
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Неможливо додати джерело ${key}`, NotificationManager.TYPE_ERROR)

      return false
    }
  }

  /**
   * @param {string} key
   * @return {Promise<boolean>}
   */
  async remove (key) {
    try {
      const sources = (await this.get())
        .filter(source => source.key !== key)

      this.updateAll(sources, true)

      return true
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Неможливо видалити дежрело ${key}`, NotificationManager.TYPE_ERROR)

      return false
    }
  }

  /**
   * @param {string} key
   * @param {Object} data
   * @return {Promise<boolean>}
   */
  async update (key, data = {}) {
    const onError = (error) => {
      console.error(error)
      NotificationManager.notify(`Неможливо оновити дежрело ${key}`, NotificationManager.TYPE_ERROR)
      return false
    }

    try {
      const sourceObjects = await SocialSourcesStorage.get('items', [])
      const foundSource = sourceObjects.find(sourceObject => sourceObject.key === key)

      if (foundSource == null) {
        return onError(`Unknown source ${key}`)
      }

      this.items[this.items.findIndex(({ key }) => key === foundSource.key)] = this[foundSource.type].parse({ ...foundSource, ...data })

      if (!this.validator.validate({ ...foundSource, initial: false })) {
        return false
      }

      await this.updateAll(this.items)

      return true
    } catch (e) {
      return onError(e)
    }
  }
}