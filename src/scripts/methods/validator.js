/**
 * @typedef {object} ValidatorPattern
 * @property {string} property
 * @property {string[]?} context
 * @property {function} callback
 * @property {string} errorMessage
 */

export default class Validator {
  /**
   *
   * @param {ValidatorPattern[]} patterns
   */
  constructor (patterns) {
    this.patterns = patterns
    this.errors = {}
  }

  getPathProperty (values, path) {
    const parts = path.split('.')

    parts.forEach(part => {
      if (values instanceof Object) {
        values = values[part]
      }
    })

    return values
  }

  validate (values = {}) {
    this.reset()

    this.patterns.forEach(({ property, context, callback, errorMessage }) => {
      const contextProperties = Array.isArray(context)
        ? context.map(key => this.getPathProperty(values, key))
        : []

      if (!callback(this.getPathProperty(values, property), ...contextProperties)) {
        this.errors[property] = errorMessage
      }
    })

    return !Object.keys(this.errors).length
  }

  reset () {
    this.errors = {}
  }
}

export function stringRangeAssertion ({ property, minLength = 0, maxLength = 255, errorMessage = 'Значення некоректне' }) {
  return {
    property,
    callback: (val) => {
      const value = typeof val === 'number' ? val : String(val).trim().length

      return value > minLength && value < maxLength
    },
    errorMessage: errorMessage
  }
}

export function emptyValueAssertion ({ property, errorMessage = null }) {
  return {
    property,
    callback: (val) => val === 0 || !!val,
    errorMessage: errorMessage ?? 'Значення не може бути порожнє'
  }
}
