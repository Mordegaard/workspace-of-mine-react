import AbstractClass from 'scripts/methods/abstractClass'
import Storage from 'scripts/methods/storage'

/**
 * @class VendorSocialBookmarks
 * @property {SocialBookmarks} controller
 * @property {string} type
 */
export default class VendorSocialBookmarks extends AbstractClass {
  static PER_PAGE = 12

  constructor (controller, type) {
    super()

    this.controller = controller
    this.type = type

    this.ids = []
  }

  async init () {
    this.ids = await this.getBookmarkIds()
  }

  async toggle (id) {
    const newIds = [ ...this.ids ]

    if (newIds.includes(id)) {
      newIds.splice(newIds.indexOf(id), 1)
    } else {
      newIds.push(id)
    }

    const sources = await Storage.local.get('social_sources', {})
    const bookmarks = sources.bookmarks ?? {}

    bookmarks[this.type] = newIds

    await Storage.local.set('social_sources', { ...sources, bookmarks })

    this.ids = newIds
  }

  /**
   * @returns {Promise<Array>}
   */
  async getBookmarkIds () {
    const sources = await Storage.local.get('social_sources', {})
    return sources.bookmarks?.[this.type] ?? []
  }

  /**
   * @returns {Promise<Array>}
   */
  async getBookmarks ({ page = 1 } = {}) {
    const ids = this.ids

    if (ids.length === 0) return []

    return this
      .controller
      .controller
      .posts[this.type]
      .getPostsById(
        ids.slice((page - 1) * this.constructor.PER_PAGE, page * this.constructor.PER_PAGE)
      )
  }
}