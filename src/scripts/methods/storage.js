class StorageInstance {
  constructor (instance, prefix = '') {
    this.instance = instance
    this.prefix = prefix
  }

  _prefixedKey (key) {
    if (this.prefix) {
      return `${this.prefix}_${key}`
    }

    return key
  }

  set (keyOrObject, value) {
    return new Promise(resolve => {
      try {
        if (typeof keyOrObject === 'object') {
          const prefixedObject = {}

          Object.keys(keyOrObject).forEach(key => prefixedObject[this._prefixedKey(key)] = keyOrObject[key])

          this.instance.set(prefixedObject, resolve)
        } else {
          this.instance.set({ [this._prefixedKey(keyOrObject)]: value }, () => resolve(true))
        }
      } catch (e) {
        console.warn('Cannot set value to the storage', e)
        resolve(false)
      }
    })
  }

  get (key, defaultValue = null) {
    return new Promise(resolve => {
      try {
        if (Array.isArray(key)) {
          this.instance.get(key.map(this._prefixedKey.bind(this)), result => {
            Object.keys(result).forEach(key => {
              if (result[key] == null) result[key] = defaultValue
            })

            resolve(result)
          })
        } else {
          this.instance.get(this._prefixedKey(key), result => {
            resolve(result[key] ?? defaultValue)
          })
        }
      } catch (e) {
        resolve(defaultValue)
      }
    })
  }

  async remove (key) {
    try {
      await this.instance.remove(this._prefixedKey(key))
      return true
    } catch (e) {
      console.warn('Cannot remove value from the storage', e)
      return false
    }
  }

  async clear () {
    await  this.instance.clear()
    return true
  }
}

class StoragePartInstance {
  constructor (key, storage) {
    this.key = key
    this.storage = storage
  }

  async get (key = null, defaultValue = null) {
    const settings = await this.storage.get(this.key) ?? {}

    if (key) return settings[key] ?? defaultValue

    return settings
  }

  async set (key, value) {
    const settings = await this.get()

    settings[key] = value

    await this.storage.set(this.key, settings)
  }

  async remove (key) {
    const settings = await this.get()

    delete settings[key]

    await this.storage.set(this.key, settings)
  }
}

export default class Storage {
  static local = new StorageInstance(chrome.storage.local)
  static session = new StorageInstance(chrome.storage.session)
}

const Settings      = new StoragePartInstance('settings', Storage.local)
const SocialSources = new StoragePartInstance('social_sources', Storage.local)
const Credentials   = new StoragePartInstance('credentials', Storage.local)

export { Settings, SocialSources, Credentials }