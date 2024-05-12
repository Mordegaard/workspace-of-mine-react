import { format } from 'date-fns'

Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max)

Array.range = function (n) {
  return Array.apply(null, Array(n)).map((x, i) => i)
}

Object.defineProperty(Array.prototype, 'includesMany', {
  value: function (keys) {
    return keys.every(key => this.includes(key))
  }
})

Object.defineProperty(Array.prototype, 'pickRandom', {
  value: function () {
    return this[random(0, this.length)]
  }
})

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (n) {
    return Array.range(Math.ceil(this.length / n)).map((x, i) => this.slice(i * n, i * n + n))
  }
})
Object.defineProperty(Array.prototype, 'shuffle', {
  value: function () {
    for (let i = this.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = this[i]
      this[i] = this[j]
      this[j] = temp
    }

    return this
  }
})

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

export function sanitize (str) {
  return typeof str === 'string'
    ? str.trim().replaceAll('&amp;', '&')
    : str
}

export function getMax (arr) {
  let len = arr.length
  let max = -Infinity

  while (len--) {
    max = arr[len] > max ? arr[len] : max
  }
  return max
}

export function formatTime (seconds) {
  const date =  new Date(seconds * 1000)
  const outputFormat = seconds < 3600 ? 'mm:ss' : 'HH:mm:ss'

  return format(date, outputFormat)
}

export function formatSize (size) {
  const suffixes = ['B', 'KB', 'MB', 'GB', 'TB']

  let result = Number(size)
  let index = 0

  while (result > 1024) {
    result /= 1024
    index++
  }

  return result.toFixed(1) + suffixes[index]
}