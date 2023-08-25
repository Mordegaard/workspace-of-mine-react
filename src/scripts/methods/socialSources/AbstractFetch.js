/**
 * @class AbstractFetch
 * @property {SocialSourcesControllerInstance} controller
 * @property {string} url
 * @property {object} defaultOptions
 * @property {object} defaultHeaders
 */
export default class AbstractFetch {
  constructor (controller) {
    this.controller     = controller
    this.url            = ''
    this.defaultOptions = {}
    this.defaultHeaders = {}
    this.cacheTTL       = 300 // 5 minutes
  }

  async get (endpoint, initialParams = {}, initialHeaders = {}, options = {}) {
    const params = { ...this.defaultOptions, ...initialParams }
    const headers = {...this.defaultHeaders, ...initialHeaders}

    const url = new URL(this.url + endpoint)

    Object.entries(params).forEach(([ key, value ]) => url.searchParams.set(key, String(value)))

    const res = await fetch(url, { ...options, headers })

    return res.json()
  }

}
