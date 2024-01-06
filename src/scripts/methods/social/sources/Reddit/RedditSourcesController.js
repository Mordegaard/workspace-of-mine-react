import AbstractSourcesController from 'scripts/methods/social/sources/AbstractSourcesController'
import { SOURCE_REDDIT } from 'scripts/methods/social/constants'
import NotificationManager from 'scripts/methods/notificationManager'
import RedditSource from 'scripts/methods/social/sources/Reddit/RedditSource'

export default class RedditSourcesController extends AbstractSourcesController {
  constructor () {
    super()

    this.type = SOURCE_REDDIT
    this.url  = process.env.REDDIT_BASE
  }

  /**
   * @return {Promise<SocialSource|null>}
   */
  async find (key) {
    const subreddit = key.trim().replaceAll('r/', '')

    try {
      const { data } = await super.get(`r/${subreddit}/about.json`)

      return {
        key,
        type: this.type,
        hidden: false,
        name: data.display_name,
        description: data.public_description,
        profile_picture: data.icon_img ?? data.community_icon
      }
    } catch (e) {
      console.error(e)
    }

    NotificationManager.notify(`Неможливо знайти субреддіт ${key}`)

    return null
  }

  parse (sourceObject) {
    return new RedditSource(sourceObject)
  }
}