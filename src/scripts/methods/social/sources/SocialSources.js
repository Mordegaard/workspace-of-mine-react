import AbstractClass from 'scripts/methods/abstractClass'

import Events from 'scripts/methods/events'
import SocialSourceValidator from 'scripts/methods/social/SocialSourceValidator'
import { SocialSources as SocialSourcesStorage } from 'scripts/methods/storage'
import NotificationManager from 'scripts/methods/notificationManager'
import RedditSourcesController from 'scripts/methods/social/sources/Reddit/RedditSourcesController'
import TelegramSourcesController from 'scripts/methods/social/sources/Telegram/TelegramSourcesController'
import TumblrSourcesController from 'scripts/methods/social/sources/Tumblr/TumblrSourcesController'

export default class SocialSources extends AbstractClass {
  /**
   * @param {SocialControllerInstance} controller
   */
  constructor (controller) {
    super()

    this.validator  = SocialSourceValidator
    this.controller = controller

    this.reddit   = new RedditSourcesController(this)
    this.telegram = new TelegramSourcesController(this)
    this.tumblr   = new TumblrSourcesController(this)

    this._storageCache = []
    this._fetched = false
  }

  /**
   * @param {SocialSource[]} sources
   * @param {boolean} fetch
   */
  async updateAll (sources, fetch = false) {
    await SocialSourcesStorage.set('items', sources)

    this._storageCache = [ ...sources ]
    this._fetched = true

    Events.trigger('sources:updated', this._storageCache)

    if (fetch) {
      this.controller.posts.getAllPosts(true)
    }
  }

  /**
   * @param {?string} [key]
   * @return {Promise<SocialSource[]|SocialSource>}
   */
  async get (key = null) {
    const sources = (
      this._fetched
      ? this._storageCache
      : await SocialSourcesStorage.get('items', [])
    ).map(source => this[source.type].parse(source))

    this._storageCache = sources
    this._fetched = true

    return key ? sources.find(source => key === source.key) : sources
  }

  /**
   * @param {string} key
   * @param {SocialSource} type
   * @return {Promise<boolean>}
   */
  async put (key, type) {
    const sources = await this.get()

    if (!this.validator.validate({ key, type, sources })) {
      NotificationManager.notify(Object.values(this.validator.errors).join('\n'), NotificationManager.TYPE_INFO)
      return false
    }

    try {
      const source = await this[type].put(key)

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
      const sources = await this.get()

      const foundSourceIndex = sources.findIndex(source => source.key === key)

      if (foundSourceIndex === -1) {
        return onError(`Unknown source ${key}`)
      }

      sources[foundSourceIndex] = { ...sources[foundSourceIndex], ...data }

      if (!this.validator.validate({ ...sources[foundSourceIndex], initial: false })) {
        return false
      }

      await this.updateAll(sources)

      return true
    } catch (e) {
      return onError(e)
    }
  }
}