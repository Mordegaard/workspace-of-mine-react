import { postWorkerMessage } from 'scripts/methods/worker'

export default class CacheManager {
  static TYPE_BLOB = 'blob'
  static TYPE_JSON = 'json'
  static TYPE_TEXT = 'text'

  /**
   * @param {string} key
   * @param {('blob'|'json'|'text')} type
   * @return {Promise<any>}
   */
  static async get (key, type = 'text') {
    const result = await postWorkerMessage('cache:get', { key, type })
    return result?.data
  }

  /**
   * @param {string} key
   * @param {BodyInit} data Passes to response
   * @param {?Number} ttl in seconds. Default value is 1 day
   * @return {Promise<any>}
   */
  static async put (key, data, ttl = null) {
    const result = postWorkerMessage('cache:put', { key, data, ttl })
    return result?.success ?? false
  }

  static async clear () {
    const result = postWorkerMessage('cache:clear')
    return result?.success ?? false
  }
}