import AbstractSource from 'scripts/methods/social/sources/AbstractSource'
import { TelegramManager } from 'scripts/methods/telegram'

/**
 * @class RedditSource
 * @augments SocialSource
 */
export default class TelegramSource extends AbstractSource {
  get url () {
    return `${this.constructor.URL}${this.key}`
  }

  async fetchProfilePicture () {
    return TelegramManager.fetchProfilePicture(this.key)
  }
}

TelegramSource.URL = process.env.TELEGRAM_BASE