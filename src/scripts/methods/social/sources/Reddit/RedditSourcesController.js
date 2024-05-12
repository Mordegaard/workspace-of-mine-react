import AbstractSourcesController from 'scripts/methods/social/sources/AbstractSourcesController'
import NotificationManager from 'scripts/methods/notificationManager'
import RedditSource from 'scripts/methods/social/sources/Reddit/RedditSource'
import { REDDIT_BASE, SOURCE_REDDIT } from 'scripts/methods/social/constants'

export default class RedditSourcesController extends AbstractSourcesController {
  constructor (controller) {
    super(controller)

    this.type = SOURCE_REDDIT
    this.url  = REDDIT_BASE
  }

  /**
   * @return {Promise<SocialSource|null>}
   */
  async find (key) {
    const subreddit = key.trim().replaceAll('r/', '')

    try {
      const { data } = await super.get(`r/${subreddit}/about.json`)

      return this.parse({
        key,
        type: this.type,
        hidden: false,
        name: data.display_name,
        description: data.public_description,
        profile_picture: data.icon_img ?? data.community_icon
      })
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