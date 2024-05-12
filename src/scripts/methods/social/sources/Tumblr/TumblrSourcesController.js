import AbstractSourcesController from 'scripts/methods/social/sources/AbstractSourcesController'
import { SOURCE_TUMBLR, TUMBLR_BASE } from 'scripts/methods/social/constants'
import NotificationManager from 'scripts/methods/notificationManager'
import TumblrSource from 'scripts/methods/social/sources/Tumblr/TumblrSource'

export default class TumblrSourcesController extends AbstractSourcesController {
  constructor (controller) {
    super(controller)

    this.type = SOURCE_TUMBLR
    this.url  = TUMBLR_BASE
    this.defaultOptions = {
      api_key: process.env.TUMBLR_API_KEY
    }
  }

  /**
   * @return {Promise<SocialSource|null>}
   */
  async find (key) {
    key = key.trim()

    try {
      const { response } = await super.get(`blog/${key}/info`)

      const descriptionContainer = document.createElement('div')
      descriptionContainer.innerHTML = response.blog.description

      return this.parse({
        key,
        type: this.type,
        hidden: false,
        name: response.blog.name,
        description: descriptionContainer.innerText,
        profile_picture: response.blog.avatar[1].url
      })
    } catch (e) {
      console.error(e)
    }

    NotificationManager.notify(`Неможливо знайти користувача @${key}`)

    return null
  }

  parse (sourceObject) {
    return new TumblrSource(sourceObject)
  }
}