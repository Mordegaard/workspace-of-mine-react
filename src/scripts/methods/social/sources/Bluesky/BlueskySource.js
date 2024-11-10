import AbstractSource from 'scripts/methods/social/sources/AbstractSource'

/**
 * @class BlueskySource
 * @augments SocialSource
 */
export default class BlueskySource extends AbstractSource {
  get url () {
    return `https://bsky.app/profile/${this.key}`
  }
}