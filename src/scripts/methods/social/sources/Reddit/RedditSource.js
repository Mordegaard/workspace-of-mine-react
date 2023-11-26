import AbstractSource from 'scripts/methods/social/sources/AbstractSource'

/**
 * @class RedditSource
 * @augments SocialSource
 */
export default class RedditSource extends AbstractSource {
  get url () {
    return `${this.constructor.URL}${this.key}`
  }
}

RedditSource.URL = process.env.REDDIT_BASE