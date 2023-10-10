import ServiceWorkerCacheManager from 'scripts/sw/cache'

export function handleMessage (event) {
  if (event.data?.type) {
    MESSAGES_MAPPING[event.data.type]?.(event.data?.data ?? {}, event.data?.id, event)
  }
}

async function cachePut ({ key, data, ttl }, id, event) {
  await ServiceWorkerCacheManager.store(key, data, ttl)

  event.source.postMessage({
    id,
    success: true
  })
}

async function cacheGet ({ key, type }, id, event) {
  const result = await ServiceWorkerCacheManager.retrieve(key, type)

  event.source.postMessage({
    id,
    data: result
  })
}

async function cacheClear (eventData, id, event) {
  await ServiceWorkerCacheManager.clearAll()

  event.source.postMessage({
    id,
    success: true
  })
}

const MESSAGES_MAPPING = {
  'cache:put': cachePut,
  'cache:get': cacheGet,
  'cache:clear': cacheClear,
}