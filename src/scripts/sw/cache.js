import { CACHE_INSTANCE_KEY, HEADER_TIMESTAMP, HEADER_TTL } from 'scripts/sw/constants'

class CacheManager {
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
}

const ServiceWorkerCacheManager = new CacheManager()

export default ServiceWorkerCacheManager