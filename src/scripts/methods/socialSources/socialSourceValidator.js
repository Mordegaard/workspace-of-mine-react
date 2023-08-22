import Validator from 'scripts/methods/validator'

import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/socialSources/index'

const SocialSourceValidator = new Validator([
  {
    property: 'key',
    context: ['type'],
    errorMessage: 'Key is invalid',
    callback: (key, type) => {
      switch (type) {
        case SOURCE_REDDIT:
          return /r\/\w+/.test(key)
        case SOURCE_TELEGRAM:
          return /t\.me\/\w+/.test(key)
        default:
          return true
      }
    }
  }
])

export default SocialSourceValidator