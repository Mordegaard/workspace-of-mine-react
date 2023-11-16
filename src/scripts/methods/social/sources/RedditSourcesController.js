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
   * @return {Promise<SocialSource|null>}
   */
  async put (key) {
    const subreddit = key.replaceAll('r/', '')

    try {
      const { data } = await super.get(`r/${subreddit}/about.json`)

      return {
        key,
        type: this.type,
        hidden: false,
        name: data.display_name,
        description: data.public_description,
        profile_picture: data.icon_img
      }
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Неможливо знайти субреддіт ${key}`)
      return null
    }
  }

  async getProfilePicture (source) {
    return source.profile_picture
  }
}