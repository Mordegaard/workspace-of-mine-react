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
   * @param {SocialSource} sourceObject
   * @return {AbstractSource}
   */
  // eslint-disable-next-line no-unused-vars
  parse (sourceObject) {
    this.throwAbstract('parse')
  }
}