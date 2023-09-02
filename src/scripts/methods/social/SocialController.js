import SocialPosts from 'scripts/methods/social/posts/SocialPosts'
import SocialSources from 'scripts/methods/social/sources/SocialSources'
import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/social/constants'

class SocialControllerInstance {
  constructor () {
    this.types = [
      SOURCE_TELEGRAM,
      SOURCE_REDDIT
    ]

    this.posts   = new SocialPosts(this)
    this.sources = new SocialSources(this)
  }
}

export const SocialController = new SocialControllerInstance()