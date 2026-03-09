import { browserAPI } from 'scripts/methods/browserApi'

export function initMessages (messages) {
  browserAPI.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (typeof messages[request.key] === 'function') {
      return messages[request.key](request.data, sender, sendResponse)
    }
  })
}

export function messageCurrentTab (key, data, callback) {
  browserAPI.tabs.query({active: true, currentWindow: true}, function([ currentTab ]) {
    browserAPI.tabs.sendMessage(
      currentTab.id,
      { key, data },
      callback
    )
  })
}

export function messageAllFrames (key, data, callback) {
  browserAPI.runtime.sendMessage(
    { key, data },
    callback
  )
}
