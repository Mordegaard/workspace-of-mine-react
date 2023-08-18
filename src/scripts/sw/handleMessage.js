import { CACHE_INSTANCE_KEY } from 'root/src/sw'

export function handleMessage (event) {
  if (event.data?.type) {
    MESSAGES_MAPPING[event.data.type]?.(event.data?.data ?? {}, event.data?.id, event)
  }
}

async function cachePut ({ key, data }, id, event) {
  const cache = await caches.open(CACHE_INSTANCE_KEY)

  await cache.put(key, new Response(data))

  event.source.postMessage({
    id,
    success: true
  })
}

async function cacheGet ({ key, type }, id, event) {
  const cache = await caches.open(CACHE_INSTANCE_KEY)

  let result

  const response = await cache.match(key)

  if (typeof response[type] === 'function') {
    result = await response[type]()
  } else {
    result = await response.text()
  }

  event.source.postMessage({
    id,
    data: result
  })
}

const MESSAGES_MAPPING = {
  'cache:put': cachePut,
  'cache:get': cacheGet
}