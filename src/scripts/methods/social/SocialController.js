import SocialPosts from 'scripts/methods/social/posts/SocialPosts'
import SocialSources from 'scripts/methods/social/sources/SocialSources'
import { SOURCE_BLUESKY, SOURCE_REDDIT, SOURCE_TELEGRAM, SOURCE_TUMBLR } from 'scripts/methods/social/constants'

class SocialControllerInstance {
  constructor () {
    this.types = [
      SOURCE_TELEGRAM,
      SOURCE_REDDIT,
      SOURCE_TUMBLR,
      SOURCE_BLUESKY,
    ]

    this.posts           = new SocialPosts(this)
    this.sources         = new SocialSources(this)
  }

  init () {
    return Promise.all([
      this.posts.init(),
      this.sources.init(),
    ])
  }
}

export const SocialController = new SocialControllerInstance()