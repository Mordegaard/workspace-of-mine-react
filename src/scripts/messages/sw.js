import { browserAPI } from 'scripts/methods/browserApi'

export const messages = {
  'tabs:initContextMenu': initContextMenu
}

function initContextMenu ({ enabled, url }) {
  const create = () => {
    browserAPI.contextMenus.create({
      documentUrlPatterns: [url],
      title: `Додати сторінку до закладок`,
      id: url,
      enabled
    })
  }

  try {
    browserAPI.contextMenus.remove(url, create)
  } catch (e) { create() }
}