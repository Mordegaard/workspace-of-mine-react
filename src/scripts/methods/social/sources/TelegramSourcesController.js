/* global telegram */

import AbstractSourcesController from 'scripts/methods/social/sources/AbstractSourcesController'
import { SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { TelegramManager } from 'scripts/methods/telegram'

export default class TelegramSourcesController extends AbstractSourcesController {
  constructor () {
    super()

    this.type = SOURCE_TELEGRAM
  }

  /**
   * @return {Promise<SocialSource|null>}
   */
  async put (key) {
    const { fullChat, chats } = await TelegramManager.client.invoke(
      new telegram.Api.channels.GetFullChannel({
        channel: key,
      })
    )

    const channel = chats.find(({ id }) => id.value === fullChat.id.value)

    if (channel != null) {
      return {
        key: channel.username,
        type: this.type,
        hidden: false,
        name: channel.title,
        description: fullChat.about
      }
    }

    return null
  }

  getProfilePicture (source) {
    return TelegramManager.getProfilePicture(source.key)
  }
}