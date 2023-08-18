import { handleInstall } from 'scripts/sw/handleInstall'
import { handleMessage } from 'scripts/sw/handleMessage'

self.addEventListener("install", handleInstall)
self.addEventListener('message', handleMessage)

export const CACHE_INSTANCE_KEY   = 'key'
export const CACHE_INSTANCE_FETCH = 'fetch'