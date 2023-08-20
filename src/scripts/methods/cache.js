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
  static async get (key, type = 'text') {
    const { data } = await postWorkerMessage('cache:get', { key, type })
    return data
  }

  /**
   * @param {string} key
   * @param {BodyInit} data
   * @return {Promise<any>}
   */
  static async put (key, data) {
    const { success } = postWorkerMessage('cache:put', { key, data })
    return success
  }
}