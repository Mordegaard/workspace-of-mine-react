import merge from 'deepmerge'

import Events from 'scripts/methods/events'
import { SettingsStorage as SettingsStorage } from 'scripts/methods/storage'
import { DEFAULT_SETTINGS } from 'scripts/methods/constants'

class SettingsInstance {
  constructor () {
    this.storage = SettingsStorage
    this._values = {}
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
   * @return {Promise<*|undefined>}
   */
  set (key, value) {
    const paths = key.split('.')

    if (paths.length > 1) {
      const object = this._extractPath(paths.slice(0, paths.length - 1).join('.'), this._values)

      object[paths.at(-1)] = value

      this.storage.set(paths[0], this._values[paths[0]])
    } else {
      this._values[key] = value
      this.storage.set(key, value)
    }

    Events.trigger(`settings:${key}:update`, value)
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

const Settings = new SettingsInstance()

export default Settings