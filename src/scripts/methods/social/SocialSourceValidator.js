import Validator from 'scripts/methods/validator'

import SocialController from 'scripts/methods/social/index'
import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/social/constants'

const SocialSourceValidator = new Validator([
  {
    property: 'type',
    errorMessage: 'Невідомий тип соціального джерела',
    callback: type => {
      return SocialController.types.includes(type)
    }
  },
  {
    property: 'key',
    context: ['type', 'initial'],
    errorMessage: 'Ідентифікатор не відповідає вимогам',
    callback: (key, type, initial) => {
      if (initial === false) return true

      switch (type) {
        case SOURCE_REDDIT:
          return /r\/\w+/.test(key)
        case SOURCE_TELEGRAM:
          return /^((.+\/)?t\.me\/)?\w+$/.test(key)
        default:
          return true
      }
    }
  },
  {
    property: 'key',
    context: ['sources'],
    errorMessage: 'Це джерело вже додане',
    callback: (key, sources) => {
      return !Array.isArray(sources) || sources.findIndex(source => source.key === key) === -1
    }
  }
])

export default SocialSourceValidator