import SocialController from 'scripts/methods/social'
import AbstractFetch from 'scripts/methods/social/AbstractFetch'

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
    this.type = null

    this.perPage  = 15
  }

  /**
   * @param {object} post
   * @param {?SocialSource} postObject
   * @return {FormattedPost}
   */
  // eslint-disable-next-line no-unused-vars
  formatPost (post, postObject = null) {
    this.throwAbstract('formatPost')
  }

  /**
   * @param {object} comment
   * @param {FormattedPost} post
   * @return {PostComment}
   */
  // eslint-disable-next-line no-unused-vars
  formatComment (comment, post) {
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
   * @param {FormattedPost} post
   * @return {Promise<PostComment[]>}
   */
  // eslint-disable-next-line no-unused-vars
  getCommentsByPost (post) {
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