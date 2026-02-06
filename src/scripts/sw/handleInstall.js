import { CACHE_INSTANCE_KEY } from 'scripts/sw/constants'

export function handleInstall (event) {
  event.waitUntil(preLoad())
}

const preLoad = () => {
  console.debug("Installing service worker")

  return caches.open(CACHE_INSTANCE_KEY).then(cache => {
    console.debug("Cache is accessible")

    return cache.addAll([
    ])
  })
}
