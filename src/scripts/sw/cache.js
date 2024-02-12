import { CACHE_INSTANCE_KEY } from 'scripts/sw/constants'

const BASE_URL         = 'https://example.com/'
const TTL              = 3 * 24 * 1000 * 3600 // default cache TTL is 3 days
const HEADER_TIMESTAMP = 'x-timestamp'
const HEADER_TTL       = 'x-ttl'

class CacheManagerBase {
  constructor (url, ttl) {
    this.intervalId = null
    this.url = url ?? BASE_URL
    this.ttl = ttl ?? TTL
  }

  stopClearingInterval () {
    clearInterval(this.intervalId)
  }

  getURL (key) {
    return this.url + key
  }

  getRequest (key, ttl) {
    return new Request(
      this.getURL(key),
      {
        headers: {
          [HEADER_TIMESTAMP]: String(new Date().getTime()),
          [HEADER_TTL]: String(ttl || this.ttl)
        }
      }
    )
  }

  async clearAll () {
    await caches.delete(CACHE_INSTANCE_KEY)
    console.warn('all caches cleared')
  }

  async clearExpired () {
    let counter = 0
    const cache = await caches.open(CACHE_INSTANCE_KEY)

    const keys = await cache.keys()

    keys.forEach((request) => {

      if (request.headers.has(HEADER_TIMESTAMP)) {
        const timestamp = parseInt(request.headers.get(HEADER_TIMESTAMP))
        const ttl = parseInt(request.headers.get(HEADER_TTL))

        const date = new Date(timestamp + ttl)

        if (date < new Date()) {
          counter++
          cache.delete(request)
        }
      }
    })

    console.log('Clearing expired cache. Items removed: ' + counter)
  }

  async store (key, data, ttl) {
    const cache = await caches.open(CACHE_INSTANCE_KEY)
    const request = this.getRequest(key, ttl)
    const response = new Response(data)

    await cache.put(request, response)
  }

  async retrieve (key, type) {
    const cache = await caches.open(CACHE_INSTANCE_KEY)
    const url = this.getURL(key)

    let result = null

    const response = await cache.match(url, { ignoreSearch: true })

    if (response != null) {
      if (typeof response[type] === 'function') {
        result = await response[type]()
      } else {
        result = await response.text()
      }
    }

    return result
  }
}

const ServiceWorkerCacheManager = new CacheManagerBase()

export default ServiceWorkerCacheManager