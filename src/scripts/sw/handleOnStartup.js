import ServiceWorkerCacheManager from 'scripts/sw/cache'

export function handleOnStartup () {
  ServiceWorkerCacheManager.clearExpired()
}