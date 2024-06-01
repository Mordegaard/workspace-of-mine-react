import AbstractClass from 'scripts/methods/abstractClass'
import { SocialController } from 'scripts/methods/social'

/**
 * @class SourceBookmarks
 * @property {AbstractSource} source
 */
export default class SourceBookmarks extends AbstractClass {
  static PER_PAGE = 12

  constructor (source, initialSourceObject) {
    super()

    this.source = source
    this.ids = Array.isArray(initialSourceObject.bookmarks) ? initialSourceObject.bookmarks : []
    this.shuffled = this.ids.slice().shuffle()
  }

  toJSON () {
    return this.ids
  }

  async toggle (id) {
    const newIds = [ ...this.ids ]

    if (newIds.includes(id)) {
      newIds.splice(newIds.indexOf(id), 1)
    } else {
      newIds.push(id)
    }

    await SocialController.sources.update(this.source.key, { bookmarks: newIds })

    this.ids = newIds
  }

  /**
   * @returns {Promise<Array>}
   */
  async getBookmarks ({ page = 1 } = {}) {
    const ids = this.shuffled

    if (ids.length === 0) return []

    return SocialController
      .posts[this.source.type]
      .getPostsById(
        ids.slice((page - 1) * this.constructor.PER_PAGE, page * this.constructor.PER_PAGE),
        this.source
      )
  }
}