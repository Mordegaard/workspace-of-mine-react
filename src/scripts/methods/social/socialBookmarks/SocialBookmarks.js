import AbstractClass from 'scripts/methods/abstractClass'
import VendorSocialBookmarks from 'scripts/methods/social/socialBookmarks/VendorSocialBookmarks'
import { SOURCE_REDDIT, SOURCE_TELEGRAM, SOURCE_TUMBLR } from 'scripts/methods/social/constants'

/**
 * @class SocialBookmarks
 * @property {SocialController} controller
 * @property {VendorSocialBookmarks} reddit
 * @property {VendorSocialBookmarks} telegram
 * @property {VendorSocialBookmarks} tumblr
 */
export default class SocialBookmarks extends AbstractClass {
  constructor (controller) {
    super()

    this.controller = controller

    this[SOURCE_REDDIT] = new VendorSocialBookmarks(this, SOURCE_REDDIT)
    this[SOURCE_TELEGRAM] = new VendorSocialBookmarks(this, SOURCE_TELEGRAM)
    this[SOURCE_TUMBLR] = new VendorSocialBookmarks(this, SOURCE_TUMBLR)
  }

  init () {
    return Promise.all([
      this[SOURCE_REDDIT].init(),
      this[SOURCE_TELEGRAM].init(),
      this[SOURCE_TUMBLR].init()
    ])
  }
}