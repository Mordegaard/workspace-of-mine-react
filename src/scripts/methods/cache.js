import { postWorkerMessage } from 'scripts/methods/worker'

export default class CacheController {
  static TYPE_BLOB = 'blob'
  static TYPE_JSON = 'json'
  static TYPE_TEXT = 'text'

  /**
   * @param {string} key
   * @param {('blob'|'json'|'text')} type
   * @return {Promise<any>}
   */
  static get (key, type = 'text') {
    return postWorkerMessage('cache:get', { key, type })
  }

  /**
   * @param {string} key
   * @param {BodyInit} data
   * @return {Promise<any>}
   */
  static put (key, data) {
    return postWorkerMessage('cache:put', { key, data })
  }
}