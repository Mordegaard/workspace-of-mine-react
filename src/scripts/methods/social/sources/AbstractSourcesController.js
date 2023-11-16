import AbstractFetch from 'scripts/methods/abstractFetch'

export default class AbstractSourcesController extends AbstractFetch {
  constructor () {
    super()

    this.type = null
  }

  /**
   * @param {string} key
   * @return {Promise<SocialSource|null>}
   */
  // eslint-disable-next-line no-unused-vars
  async put (key) {
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