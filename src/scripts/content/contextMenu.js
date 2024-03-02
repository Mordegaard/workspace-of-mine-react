import { BookmarksStorage as BookmarksStorage } from 'scripts/methods/storage'
import { messageAllFrames } from 'scripts/messages'
import Settings from 'scripts/methods/settings'

export async function initContextMenu () {
  const bookmarks = await BookmarksStorage.get('items', [])
  const { rows, columns } = await Settings.get('bookmarks_grid')

  if (bookmarks.length < rows * columns) {
    messageAllFrames('tabs:initContextMenu', {
      enabled: !bookmarks.some(({ url }) => url === window.location.href),
      url: window.location.origin + window.location.pathname
    })
  }
}

