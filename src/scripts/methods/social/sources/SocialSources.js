import AbstractClass from 'scripts/methods/abstractClass'

import Events from 'scripts/methods/events'
import SocialSourceValidator from 'scripts/methods/social/socialSourceValidator'
import { SocialSources as SocialSourcesStorage } from 'scripts/methods/storage'
import NotificationManager from 'scripts/methods/notificationManager'
import RedditSourcesController from 'scripts/methods/social/sources/RedditSourcesController'
import TelegramSourcesController from 'scripts/methods/social/sources/TelegramSourcesController'

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
  }

  /**
   * @param {SocialSource[]} sources
   * @param {boolean} fetch
   * @private
   */
  async _updateAll (sources, fetch = false) {
    await SocialSourcesStorage.set('items', sources)

    Events.trigger('sources:updated', sources)

    if (fetch) {
      this.controller.posts.getAllPosts(true)
    }
  }

  /**
   * @return {Promise<SocialSource[]>}
   */
  async get () {
    return SocialSourcesStorage.get('items', [])
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
      const source = await this[type].put(key, type)

      if (source == null) {
        return false
      }

      sources.push(source)

      this._updateAll(sources, true)

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

      this._updateAll(sources, true)

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
    try {
      const sources = await this.get()

      let foundSource = sources.find(source => source.key === key) ?? {}

      foundSource = { ...foundSource, ...data }

      if (!this.validator.validate({ key, type: foundSource.type })) {
        return false
      }

      this._updateAll(sources)

      return true
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Неможливо оновити дежрело ${key}`, NotificationManager.TYPE_ERROR)

      return false
    }
  }
}