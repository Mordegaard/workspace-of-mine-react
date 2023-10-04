import { handleInstall } from 'scripts/sw/handleInstall'
import { handleMessage } from 'scripts/sw/handleMessage'
import { initMessages } from 'scripts/messages'
import { initContextMenu } from 'scripts/sw/contextMenu'
import { messages } from 'scripts/messages/sw'

self.addEventListener("install", handleInstall)
self.addEventListener('message', handleMessage)

initContextMenu()
initMessages(messages)