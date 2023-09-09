Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max)

Array.prototype.includesMany = function (keys) {
  return keys.every(key => this.includes(key))
}

export function mergeClasses (...classes) {
  return [ ...classes ].filter(Boolean).join(' ')
}

export function isTouchDevice () {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0))
}

export function generateToken () {
  return Math.random().toString(36).substr(2)
}

export function random (min, max = null) {
  if (max == null) return Math.floor(Math.random() * min)

  return Math.floor(Math.random() * (max - min)) + min
}

export function additiveMergeObjects (startObject, ...objects) {
  const result = { ...startObject }

  objects.forEach(object => {
    Object.entries(object).forEach(([ key, value ]) => {
      result[key] = value || result[key]
    })
  })

  return result
}