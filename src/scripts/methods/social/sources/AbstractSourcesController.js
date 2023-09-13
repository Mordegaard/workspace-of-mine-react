import AbstractFetch from 'scripts/methods/social/AbstractFetch'

export default class AbstractSourcesController extends AbstractFetch {
  constructor () {
    super()

    this.type = null
  }

  /**
   * @param {string} key
   * @param {SourceType} type
   * @return {SocialSource}
   */
  // eslint-disable-next-line no-unused-vars
  async put (key, type) {
    this.throwAbstract('put')
  }

  /**
   * @param {SocialSource} source
   * @return {Promise<?string>}
   */
  // eslint-disable-next-line no-unused-vars
  async getProfilePicture (source) {
    this.throwAbstract('getProfilePicture')
  }
}