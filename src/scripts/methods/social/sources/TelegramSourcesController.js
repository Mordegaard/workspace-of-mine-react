/* global telegram */

import AbstractSourcesController from 'scripts/methods/social/sources/AbstractSourcesController'
import { SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { TelegramController } from 'scripts/methods/telegram'

export default class TelegramSourcesController extends AbstractSourcesController {
  constructor () {
    super()

    this.type = SOURCE_TELEGRAM
  }

  /**
   * @return {Promise<SocialSource>|null}
   */
  async put (key, type) {
    const { fullChat, chats } = await TelegramController.client.invoke(
      new telegram.Api.channels.GetFullChannel({
        channel: key,
      })
    )

    const channel = chats.find(({ id }) => id.value === fullChat.id.value)

    return {
      key: channel.username,
      type,
      hidden: false,
      name: channel.title,
      description: fullChat.about
    }
  }
}