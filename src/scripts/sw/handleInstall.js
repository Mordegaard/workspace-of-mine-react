import { CACHE_INSTANCE_KEY } from 'root/src/sw'

export function handleInstall (event) {
  event.waitUntil(preLoad())
}

const preLoad = () => {
  console.log("Installing service worker")

  return caches.open(CACHE_INSTANCE_KEY).then(cache => {
    console.log("Cache is accessible")

    return cache.addAll([
    ])
  })
}
