import AbstractSourcesController from 'scripts/methods/social/sources/AbstractSourcesController'
import { SOURCE_TUMBLR } from 'scripts/methods/social/constants'
import NotificationManager from 'scripts/methods/notificationManager'

export default class TumblrSourcesController extends AbstractSourcesController {
  constructor () {
    super()

    this.type = SOURCE_TUMBLR
    this.url  = process.env.TUMBLR_BASE
    this.defaultOptions = {
      api_key: process.env.TUMBLR_API_KEY
    }
  }

  /**
   * @return {Promise<SocialSource|null>}
   */
  async put (key) {
    try {
      const { response } = await super.get(`blog/${key}/info`)

      const descriptionContainer = document.createElement('div')
      descriptionContainer.innerHTML = response.blog.description

      return {
        key,
        type: this.type,
        hidden: false,
        name: response.blog.name,
        description: descriptionContainer.innerText,
        profile_picture: response.blog.avatar[1].url
      }
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Неможливо знайти користувача ${key}`)
      return null
    }
  }

  async getProfilePicture (source) {
    return source.profile_picture
  }
}