export default class Validator {
  /**
   *
   * @param {{ property: string, context: [string]|undefined, callback: function, errorMessage: string }[]} patterns
   */
  constructor (patterns) {
    this.patterns = patterns
    this.errors = {}
  }

  validate (values = {}) {
    this.reset()

    this.patterns.forEach(({ property, context, callback, errorMessage }) => {
      const contextProperties = Array.isArray(context)
        ? context.map(key => values[key])
        : []

      if (!callback(values[property], ...contextProperties)) {
        this.errors[property] = errorMessage
      }
    })

    return !Object.keys(this.errors).length
  }

  reset () {
    this.errors = {}
  }
}

export function stringRangeAssertion (property, minMaxLength, maxLength = null, errorMessage = null) {
  let min = 0
  let max = minMaxLength

  if (maxLength != null) {
    min = minMaxLength
    max = maxLength
  }

  return {
    property,
    callback: (val) => {
      const value = typeof val === 'number' ? val : String(val).trim().length

      return value > min && value < max
    },
    errorMessage: errorMessage ?? 'Значення некоректне'
  }
}

export function emptyValueAssetion (property, errorMessage = null) {
  return {
    property,
    callback: (val) => val === 0 || !!val,
    errorMessage: errorMessage ?? 'Значення не може бути порожнє'
  }
}
