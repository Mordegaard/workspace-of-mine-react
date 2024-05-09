import SocialController from 'scripts/methods/social'
import AbstractFetch from 'scripts/methods/abstractFetch'

/**
 * @abstract
 */
export default class AbstractPostsController extends AbstractFetch {
  /**
   * @param {SocialPosts} controller
   */
  constructor (controller) {
    super()

    this.controller = controller
    this.type       = null
  }

  async getPerPage () {
    const count = (await SocialController.sources.get()).length

    return Math.floor(20 / (count + 2) + 5)
  }

  /**
   * @param {object} post
   * @param {AbstractSource} source
   * @return {Promise<FormattedPost>}
   */
  // eslint-disable-next-line no-unused-vars
  async formatPost (post, source) {
    this.throwAbstract('formatPost')
  }

  /**
   * @param {object} comment
   * @param {FormattedPost} post
   * @return {Promise<PostComment>}
   */
  // eslint-disable-next-line no-unused-vars
  async formatComment (comment, post) {
    this.throwAbstract('formatComment')
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
   * @param {Array} ids
   * @returns {Promise<Array>}
   */
  // eslint-disable-next-line no-unused-vars
  async getPostsById (ids = []) {
    this.throwAbstract('getPostsById')
  }

  /**
   * @param {FormattedPost} post
   * @return {Promise<PostComment[]>}
   */
  // eslint-disable-next-line no-unused-vars
  async getCommentsByPost (post) {
    this.throwAbstract('getCommentsByPost')
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

  async getSource (source) {
    return SocialController.sources.get(source)
  }
}