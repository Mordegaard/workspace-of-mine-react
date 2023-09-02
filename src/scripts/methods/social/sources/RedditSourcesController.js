import AbstractSourcesController from 'scripts/methods/social/sources/AbstractSourcesController'
import { SOURCE_REDDIT } from 'scripts/methods/social/constants'
import NotificationManager from 'scripts/methods/notificationManager'

export default class RedditSourcesController extends AbstractSourcesController {
  constructor () {
    super()

    this.type = SOURCE_REDDIT
    this.url  = process.env.REDDIT_BASE
  }

  /**
   * @return {Promise<SocialSource>|null}
   */
  async put (key, type) {
    const subreddit = key.replaceAll('r/', '')

    try {
      const { data } = await super.get(`/r/${subreddit}/about.json`)

      return {
        key,
        type,
        hidden: false,
        name: data.display_name,
        description: data.public_description
      }
    } catch (e) {
      NotificationManager.notify(`Неможливо знайти субреддіт ${key}`)
      return false
    }
  }
}