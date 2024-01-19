import AbstractSource from 'scripts/methods/social/sources/AbstractSource'

import { REDDIT_BASE } from 'scripts/methods/social/constants'

/**
 * @class RedditSource
 * @augments SocialSource
 */
export default class RedditSource extends AbstractSource {
  get url () {
    return `${REDDIT_BASE}${this.key}`
  }
}