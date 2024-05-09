import SocialPosts from 'scripts/methods/social/posts/SocialPosts'
import SocialSources from 'scripts/methods/social/sources/SocialSources'
import SocialBookmarks from 'scripts/methods/social/socialBookmarks/SocialBookmarks'
import { SOURCE_REDDIT, SOURCE_TELEGRAM, SOURCE_TUMBLR } from 'scripts/methods/social/constants'

class SocialControllerInstance {
  constructor () {
    this.types = [
      SOURCE_TELEGRAM,
      SOURCE_REDDIT,
      SOURCE_TUMBLR
    ]

    this.posts           = new SocialPosts(this)
    this.sources         = new SocialSources(this)
    this.socialBookmarks = new SocialBookmarks(this)
  }

  init () {
    return Promise.all([
      this.posts.init(),
      this.sources.init(),
      this.socialBookmarks.init()
    ])
  }
}

export const SocialController = new SocialControllerInstance()