import { getMax } from 'scripts/methods/helpers'
import { rgbToHex } from './converters'
import { AUTO_ACCENT_COLOR_TYPE_GENERAL, AUTO_ACCENT_COLOR_TYPE_SATURATED } from 'scripts/methods/constants'

/**
 * @param {string} imageSrc
 * @return {Promise<{saturated: string, general: string}>}
 */
export function extractAccentColors (imageSrc) {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    canvas.width = 96
    canvas.height = 96

    const img = new Image()

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let d = imageData.data

      const colors = []

      for (let i = 0; i < d.length; i+= 4) {
        colors.push([ d[i], d[i + 1], d[i + 2] ])
      }

      const comparedDistances = colors.map(color => getHeight(color))

      const maxDistanceIndex = comparedDistances.indexOf(getMax(comparedDistances))
      const maxDistanceColor = colors[maxDistanceIndex]
      const saturatedAccentColor = rgbToHex(maxDistanceColor)

      canvas.width = 1
      canvas.height = 1

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      d = imageData.data

      const generalAccentColor = rgbToHex(d)

      resolve({
        [AUTO_ACCENT_COLOR_TYPE_SATURATED]: saturatedAccentColor,
        [AUTO_ACCENT_COLOR_TYPE_GENERAL]: generalAccentColor
      })
    }

    img.src = imageSrc
  })
}

function getHeight (point) {
  const normalized = point.map(value => value / 255)
  const [ x, y, z ] = normalized

  const a = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
  const cosB = (x + y + z) / (Math.sqrt(3) * a)
  const sinB = Math.sqrt(1 - cosB ** 2)

  return a * sinB
}