import { CACHE_INSTANCE_KEY } from 'root/src/sw'

const BASE_URL       = 'https://example.com/'
const CHECK_INTERVAL = 30 * 1000 // check cache expiration every 30 seconds
const TTL            = 24 * 3600 * 1000 // cache TTL is 1 day

class CacheControllerBase {
  constructor (url, ttl) {
    this.intervalId = null
    this.url = url ?? BASE_URL
    this.ttl = ttl ?? TTL

    this.startClearingInterval()
  }

  startClearingInterval () {
    this.clearExpired()

    this.intervalId = setInterval(() => {
      this.clearExpired()
    }, CHECK_INTERVAL)
  }

  stopClearingInterval () {
    clearInterval(this.intervalId)
  }

  getURL (key, ttl = 0) {
    return this.url + key + `?timestamp=${ new Date().getTime() }&ttl=${ ttl || this.ttl }`
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
      if (request.url.includes('timestamp')) {
        const url = new URL(request.url)

        const timestamp = url.searchParams.get('timestamp')
        const ttl = url.searchParams.get('ttl') || this.ttl

        const date = new Date(parseInt(timestamp) + parseInt(ttl))

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
    const url = this.getURL(key, ttl)

    const response = new Response(data)

    Object.defineProperty(response, 'url', { value: url })

    await cache.put(url, response)
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

const ServiceWorkerCacheController = new CacheControllerBase()

export default ServiceWorkerCacheController