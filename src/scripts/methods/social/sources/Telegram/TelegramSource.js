import AbstractSource from 'scripts/methods/social/sources/AbstractSource'
import { TelegramManager } from 'scripts/methods/telegram'
import { TELEGRAM_BASE } from 'scripts/methods/social/constants'

/**
 * @class RedditSource
 * @augments SocialSource
 */
export default class TelegramSource extends AbstractSource {
  get url () {
    return `${TELEGRAM_BASE}${this.key}`
  }

  async fetchProfilePicture () {
    return TelegramManager.fetchProfilePicture(this.key)
  }
}