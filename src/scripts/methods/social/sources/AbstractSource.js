import AbstractClass from 'scripts/methods/abstractClass'

/**
 * @class RedditSource
 * @augments SocialSource
 */
export default class AbstractSource extends AbstractClass {
  /**
   * @param {SocialSource} sourceObject
   */
  constructor (sourceObject = {}) {
    super()

    this.key = sourceObject.key
    this.name = sourceObject.name
    this.hidden = sourceObject.hidden
    this.type = sourceObject.type
    this.description = sourceObject.description
    this.profile_picture = sourceObject.profile_picture
  }

  get url () {
    return this.throwAbstract('url getter')
  }

  /**
   * @return {Promise<?string>}
   */
  async fetchProfilePicture () {
    return this.profile_picture
  }
}