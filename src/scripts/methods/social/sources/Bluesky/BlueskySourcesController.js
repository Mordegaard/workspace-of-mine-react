import AbstractSourcesController from 'scripts/methods/social/sources/AbstractSourcesController'
import { BLUESKY_BASE, SOURCE_BLUESKY } from 'scripts/methods/social/constants'
import NotificationManager from 'scripts/methods/notificationManager'
import BlueskySource from 'scripts/methods/social/sources/Bluesky/BlueskySource'

export default class BlueskySourcesController extends AbstractSourcesController {
  constructor (controller) {
    super(controller)

    this.type = SOURCE_BLUESKY
    this.url  = BLUESKY_BASE
  }

  /**
   * @return {Promise<SocialSource|null>}
   */
  async find (key) {
    key = key.trim()

    try {
      const data = await super.get(`app.bsky.actor.getProfile`, { actor: key })

      return this.parse({
        key,
        type: this.type,
        hidden: false,
        name: data.displayName,
        description: data.description,
        profile_picture: data.avatar
      })
    } catch (e) {
      console.error(e)
    }

    NotificationManager.notify(`Неможливо знайти користувача ${key}`)

    return null
  }

  parse (sourceObject) {
    return new BlueskySource(sourceObject)
  }
}