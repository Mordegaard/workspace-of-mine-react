export const messages = {
  'tabs:initContextMenu': initContextMenu
}

function initContextMenu ({ enabled, url }) {
  chrome.contextMenus.remove(url, () => {
    chrome.contextMenus.create({
      documentUrlPatterns: [url],
      title: `Додати сторінку до закладок`,
      id: url,
      enabled
    })
  })
}