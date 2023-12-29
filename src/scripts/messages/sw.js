export const messages = {
  'tabs:initContextMenu': initContextMenu
}

function initContextMenu ({ enabled, url }) {
  const create = () => {
    chrome.contextMenus.create({
      documentUrlPatterns: [url],
      title: `Додати сторінку до закладок`,
      id: url,
      enabled
    })
  }

  try {
    chrome.contextMenus.remove(url, create)
  } catch (e) { create() }
}