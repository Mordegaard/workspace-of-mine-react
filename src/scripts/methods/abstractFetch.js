import AbstractClass from 'scripts/methods/abstractClass'

/**
 * @class AbstractFetch
 * @property {string} url
 * @property {object} defaultOptions
 * @property {object} defaultHeaders
 */
export default class AbstractFetch extends AbstractClass {
  constructor () {
    super()

    this.url            = ''
    this.defaultOptions = {}
    this.defaultHeaders = {}
  }

  async get (endpoint, params = {}, headers = {}, options = {}) {
    const resultParams = { ...this.defaultOptions, ...params }
    const resultHeaders = { ...this.defaultHeaders, ...headers }

    const url = new URL(this.url + endpoint)

    if (params instanceof URLSearchParams) {
      url.search = params.toString()
    } else {
      Object.entries(resultParams).forEach(([ key, value ]) => url.searchParams.set(key, String(value)))
    }

    const res = await fetch(url, { ...options, headers: resultHeaders })

    return res.json()
  }

}
