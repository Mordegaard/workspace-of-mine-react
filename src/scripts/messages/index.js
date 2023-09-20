export function initMessages (messages) {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (typeof messages[request.key] === 'function') {
      return messages[request.key](request.data, sender, sendResponse)
    }
  })
}

export function messageCurrentTab (key, data, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function([ currentTab ]) {
    chrome.tabs.sendMessage(
      currentTab.id,
      { key, data },
      callback
    )
  })
}

export function messageAllFrames (key, data, callback) {
  chrome.runtime.sendMessage(
    { key, data },
    callback
  )
}
