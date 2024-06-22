import merge from 'deepmerge'

import Events from 'scripts/methods/events'
import { SettingsStorage as SettingsStorage } from 'scripts/methods/storage'
import { DEFAULT_SETTINGS } from 'scripts/methods/constants'

class Settings {
  constructor () {
    this.storage = SettingsStorage
    this._values = {}
    this.context = {}
  }

  async init () {
    this._values = merge(DEFAULT_SETTINGS, await this.storage.get())
  }

  /**
   * @param {string|null} [key]
   * @param [defaultValue]
   * @return {any}
   */
  get (key = null, defaultValue = null) {
    if (typeof key === 'string') {
      return this._extractPath(key, this._values) ?? defaultValue
    }

    return this._values
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  set (key, value) {
    const breadcrumbs = key.split('.')

    if (breadcrumbs.length > 1) {
      const previousBreadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1)
      const object = this._extractPath(previousBreadcrumbs.join('.'), this._values)

      object[breadcrumbs.at(-1)] = value

      this.storage.set(breadcrumbs[0], this._values[breadcrumbs[0]])
    } else {
      this._values[key] = value
      this.storage.set(key, value)
    }

    Events.trigger(`settings:${key}:update`, value)
    Events.trigger(`settings:update`)
  }

  /**
   * @param {string} key
   * @param {Object} object
   * @private
   */
  _extractPath (key, object) {
    let result = object

    for (const path of key.split('.')) {
      result = result[path]

      if (result == null) break
    }

    return result
  }
}

const SettingsManager = new Settings()

export default SettingsManager