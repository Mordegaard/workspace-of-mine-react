import AbstractSource from 'scripts/methods/social/sources/AbstractSource'
import { SocialController } from 'scripts/methods/social'

/**
 * @class BlueskySource
 * @augments SocialSource
 */
export default class BlueskySource extends AbstractSource {
  get url () {
    return `https://bsky.app/profile/${this.key}`
  }

  async fetchProfilePicture () {
    const data = await SocialController.sources.bluesky.get(`app.bsky.actor.getProfile`, { actor: this.key })
    return data.avatar
  }
}