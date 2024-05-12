import AbstractSourcesController from 'scripts/methods/social/sources/AbstractSourcesController'
import { SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { TelegramManager } from 'scripts/methods/telegram'
import TelegramSource from 'scripts/methods/social/sources/Telegram/TelegramSource'
import NotificationManager from 'scripts/methods/notificationManager'

export default class TelegramSourcesController extends AbstractSourcesController {
  constructor (controller) {
    super(controller)

    this.type = SOURCE_TELEGRAM
  }

  /**
   * @return {Promise<SocialSource|null>}
   */
  async find (key) {
    if (key.includes('t.me/')) {
      key = key.split('/').at(-1)
    }

    try {
      const { fullChat, chats } = await TelegramManager.getChannel(key)

      const channel = chats.find(({ id }) => id.value === fullChat.id.value)

      if (channel != null) {
        return this.parse({
          key: channel.username,
          type: this.type,
          hidden: false,
          name: channel.title,
          description: fullChat.about
        })
      }
    } catch (e) {
      console.error(e)
    }

    NotificationManager.notify(`Неможливо знайти канал чи групу ${key}`)

    return null
  }

  parse (sourceObject) {
    return new TelegramSource(sourceObject)
  }
}