import { CACHE_INSTANCE_KEY, HEADER_TIMESTAMP, HEADER_TTL } from 'scripts/sw/constants'

const BASE_URL         = 'https://example.com/'
const TTL              = 3 * 24 * 1000 * 3600 // default cache TTL is 3 days

export default class CacheManager {
  static TYPE_BLOB         = 'blob'
  static TYPE_JSON         = 'json'
  static TYPE_TEXT         = 'text'
  static TYPE_ARRAY_BUFFER = 'arrayBuffer'
  static TYPE_FORM_DATA    = 'formData'

  constructor (url, ttl) {
    this.url = url ?? BASE_URL
    this.ttl = ttl ?? TTL
  }

  keyToRequest (key, ttl) {
    return new Request(
      this.url + key,
      {
        headers: {
          [HEADER_TIMESTAMP]: String(new Date().getTime()),
          [HEADER_TTL]: String(ttl || this.ttl)
        }
      }
    )
  }

  dataToResponse (data) {
    if ([Object.prototype, Array.prototype].includes(Object.getPrototypeOf(data))) {
      return new Response(JSON.stringify(data))
    }

    return new Response(data)
  }

  async clear () {
    await caches.delete(CACHE_INSTANCE_KEY)
    console.warn('all caches cleared')
  }

  /**
   * @param {string} key
   * @param {BodyInit|ResponseInit} data Passes to response
   * @param {?Number} ttl in seconds. Default value is 3 days
   * @return {Promise<void>}
   */
  async put (key, data, ttl) {
    const cache = await caches.open(CACHE_INSTANCE_KEY)

    const request = this.keyToRequest(key, ttl)
    const response = this.dataToResponse(data)

    await cache.put(request, response)
  }

  /**
   * @param {string} key
   * @param {'blob'|'json'|'text'|'arrayBuffer'|'formData'} type
   * @return {Promise<any>}
   */
  async get (key, type) {
    const cache = await caches.open(CACHE_INSTANCE_KEY)
    const request = this.keyToRequest(key)

    let result = null

    const response = await cache.match(request)

    if (response != null) {
      if (typeof response[type] === 'function') {
        result = await response[type]()
      } else {
        result = await response.text()
      }
    }

    return result
  }

  /**
   * @param {string} key
   * @param {BodyInit|ResponseInit} data Passes to response
   * @param {?Number} ttl in seconds. Default value is 3 days
   * @return {Promise<void>}
   */
  static put (key, data, ttl) {
    return new this().put(key, data, ttl)
  }

  /**
   * @param {string} key
   * @param {'blob'|'json'|'text'|'arrayBuffer'|'formData'} type
   * @return {Promise<any>}
   */
  static get (key, type) {
    return new this().get(key, type)
  }

  static clear () {
    return new this().clear()
  }
}