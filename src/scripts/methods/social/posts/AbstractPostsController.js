import SocialController from 'scripts/methods/social'
import AbstractFetch from 'scripts/methods/social/AbstractFetch'

/**
 * @abstract
 */
export default class AbstractPostsController extends AbstractFetch {
  constructor (controller) {
    super()


    this.controller = controller
    this.type = null

    this.perPage  = 15
    this.cacheTTL = 30 * 60 // 30 minutes
  }

  /**
   * @param {object} post
   * @return {FormattedPost}
   */
  // eslint-disable-next-line no-unused-vars
  formatPost (post) {
    this.throwAbstract('formatPost')
  }

  /**
   * @param {string} source
   * @param {object} options
   * @return {Promise<{posts: [], formattedPosts: []}>}
   */
  // eslint-disable-next-line no-unused-vars
  getPostsBySource (source, options = {}) {
    this.throwAbstract('getPostsBySource')
  }

  /**
   * @return {Promise<Awaited<{formattedPosts: *, posts: *}|undefined>[]>}
   */
  async getAllPosts () {
    const sources = await SocialController.sources.get()
    const keys = sources
      .filter(({ hidden, type }) => !hidden && type === this.type)
      .map(({ key }) => key)

    const promises = keys.map(key => this.getPostsBySource(key))

    return Promise.all(promises)
  }
}