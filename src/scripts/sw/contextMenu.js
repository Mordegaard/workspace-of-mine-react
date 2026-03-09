import { BookmarksStorage as BookmarksStorage } from 'scripts/methods/storage'
import { browserAPI } from 'scripts/methods/browserApi'

export function initContextMenu () {
  browserAPI.contextMenus.onClicked.addListener(async data => {
    browserAPI.tabs.query({ active: true, currentWindow: true }, async function([ tab ]) {
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

      browserAPI.contextMenus.update(data.menuItemId, {
        enabled: false,
        title: 'Сторінку успішно додано до закладок'
      })
    })
  })
}