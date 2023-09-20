import { MAX_BOOKMARKS_COUNT } from 'scripts/methods/bookmarks/constants'
import { Bookmarks as BookmarksStorage } from 'scripts/methods/storage'
import { messageAllFrames } from 'scripts/messages'

export async function initContextMenu () {
  const bookmarks = await BookmarksStorage.get('items', [])

  if (bookmarks.length < MAX_BOOKMARKS_COUNT) {
    messageAllFrames('tabs:initContextMenu', {
      enabled: !bookmarks.some(({ url }) => url === window.location.href),
      url: window.location.origin + window.location.pathname
    })
  }
}

