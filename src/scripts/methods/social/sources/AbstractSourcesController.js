import AbstractFetch from 'scripts/methods/abstractFetch'

/**
 * @class AbstractSourcesController
 * @abstract
 * @property {SocialSources} controller
 * @property {SourceType} type
 */
export default class AbstractSourcesController extends AbstractFetch {
  constructor (controller) {
    super()

    this.type = null
    this.controller = controller
  }

  async init () {}

  /**
   * @param {string} key
   * @return {Promise<SocialSource|null>}
   */
  // eslint-disable-next-line no-unused-vars
  async find (key) {
    this.throwAbstract('find')
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