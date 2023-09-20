import { Bookmarks as BookmarksStorage } from 'scripts/methods/storage'

export function initContextMenu () {
  chrome.contextMenus.onClicked.addListener(async data => {
    chrome.tabs.query({ active: true, currentWindow: true }, async function([ tab ]) {
      const bookmarks = await BookmarksStorage.get('items', [])

      /** @type Bookmark */
      const bookmark = {
        name: tab.title,
        url: tab.url,
      }

      if (tab.favIconUrl) {
        bookmark.icon = {
          type: 'url',
          data: tab.favIconUrl
        }
      }

      bookmarks.push(bookmark)

      await BookmarksStorage.set('items', bookmarks)

      chrome.contextMenus.update(data.menuItemId, {
        enabled: false,
        title: 'Сторінку успішно додано до закладок'
      })
    })
  })
}