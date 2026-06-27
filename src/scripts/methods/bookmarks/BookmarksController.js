import AbstractClass from 'scripts/methods/abstractClass'
import BookmarkValidator from 'scripts/methods/bookmarks/BookmarkValidator'
import Events from 'scripts/methods/events'
import NotificationManager from 'scripts/methods/notificationManager'
import { BookmarksStorage as BookmarksStorage } from 'scripts/methods/storage'

class BookmarksControllerInstance extends AbstractClass {
  constructor () {
    super()

    this.validator = BookmarkValidator
  }

  /**
   * @param {number?} index
   * @return {Promise<Bookmark[]|Bookmark>}
   */
  async get (index) {
    const bookmarks = await BookmarksStorage.get('items', [])

    bookmarks.forEach((bookmark, index) => {
      bookmark.index = index
    })

    return index ? bookmarks[index] : bookmarks
  }

  /**
   *
   * @param {Bookmark[]} bookmarks
   * @return {Promise<void>}
   */
  async updateAll (bookmarks) {
    const payload = structuredClone(bookmarks)

    payload.forEach((bookmark) => {
      delete bookmark.index
    })

    await BookmarksStorage.set('items', payload)

    Events.trigger('bookmarks:updated', await this.get())
  }

  /**
   * @param {Bookmark} bookmark
   * @return {Promise<boolean>}
   */
  async put (bookmark) {
    const payload = structuredClone(bookmark)
    delete payload.index

    const bookmarks = await this.get()

    if (!this.validator.validate({ payload, bookmarks })) {
      return false
    }

    try {
      bookmarks.push(payload)

      await this.updateAll(bookmarks)

      return true
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Неможливо закладку ${name}`, NotificationManager.TYPE_ERROR)

      return false
    }
  }

  /**
   * @param {number} index
   * @return {Promise<boolean>}
   */
  async remove (index) {
    try {
      const bookmarks = await this.get()

      bookmarks.splice(index, 1)

      await this.updateAll(bookmarks)

      return true
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Неможливо видалити закладку ${key}`, NotificationManager.TYPE_ERROR)

      return false
    }
  }

  /**
   *
   * @param {number} index
   * @param {object} data
   * @return {Promise<boolean>}
   */
  async update (index, data) {
    const onError = (error) => {
      console.error(error)
      NotificationManager.notify(`Неможливо оновити закладку`, NotificationManager.TYPE_ERROR)
      return false
    }

    try {
      const bookmarks = await this.get()

      const targetBookmark = bookmarks[index]

      if (targetBookmark == null) {
        return onError(`Unknown bookmark with index ${index}`)
      }

      bookmarks[index] = { ...bookmarks[index], ...data }

      if (!this.validator.validate({ bookmark: bookmarks[index] })) {
        return false
      }

      await this.updateAll(bookmarks)

      return true
    } catch (e) {
      return onError(e)
    }
  }
}

export const BookmarksController = new BookmarksControllerInstance()