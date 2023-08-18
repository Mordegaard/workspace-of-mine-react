class StorageInstance {
  constructor (instance) {
    this.instance = instance
    this.prefix = 'mbr_'
  }

  set (key, value) {
    try {
      this.instance.setItem(this.prefix + key, JSON.stringify(value))
    } catch (e) {
      console.warn('Cannot set value to the storage', e)
      return false
    }

    return true
  }

  get (key, defaultValue = null) {
    try {
      return JSON.parse(this.instance.getItem(this.prefix + key)) ?? defaultValue
    } catch (e) {
      return defaultValue
    }
  }

  remove (key) {
    try {
      this.instance.removeItem(this.prefix + key)
    } catch (e) {
      console.warn('Cannot remove value from the storage', e)
      return false
    }

    return true
  }
}

class ObjectStorageInstance {
  constructor () {
    this.storage = {}
  }

  set (key, value) {
    this.storage[key] = value
    return true
  }

  get (key, defaultValue = null) {
    return this.storage[key] ?? defaultValue
  }

  remove (key) {
    delete this.storage[key]
  }
}

export default class Storage {
  static local   = initStorage('localStorage')
  static session = initStorage('sessionStorage')
  static object  = new ObjectStorageInstance()
}

function initStorage(storageInstanceName) {
  try {
    return new StorageInstance(window[storageInstanceName])
  } catch (e) {
    return new ObjectStorageInstance()
  }
}