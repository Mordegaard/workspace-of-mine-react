import AbstractSource from 'scripts/methods/social/sources/AbstractSource'

/**
 * @class RedditSource
 * @augments SocialSource
 */
export default class TumblrSource extends AbstractSource {
  get url () {
    return `https://${this.key}.tumblr.com`
  }
}

TumblrSource.URL = process.env.TUMBLR_BASE