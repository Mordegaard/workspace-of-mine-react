import { useEffect } from 'react'
import { formatRGB, extractAccentColors, hexToRgb } from 'scripts/methods/colors'
import { useCustomEvent } from 'scripts/methods/hooks'
import Settings from 'scripts/methods/settings'

export function AccentColorHandler () {
  useCustomEvent(
    ['settings:accent_color.value:update', 'settings:accent_color.auto:update', 'settings:wallpaper.value:update'],
    initColors
  )

  useCustomEvent('wallpaper:fetched', onWallpaperFetched)

  useEffect(() => {
    initColors()
  }, [])

  return null
}

async function onWallpaperFetched ({ detail: photo }) {
  const isAuto = await Settings.get('accent_color.auto')

  if (!isAuto) return
  if (!photo) return initColors()

  const extractedColors = await extractAccentColors(photo.src.tiny)
  const rgbPrimaryColor = hexToRgb(extractedColors.saturated)

  setColors(rgbPrimaryColor)
}

async function initColors () {
  const settings = Settings.get()
  const { value: accentColor, auto: isAuto } = settings.accent_color

  let rgbPrimaryColor

  if (isAuto) {
    const extractedColors = await extractAccentColors(settings.wallpaper.value)
    rgbPrimaryColor = hexToRgb(extractedColors.saturated)
  } else {
    rgbPrimaryColor = hexToRgb(accentColor)
  }

  setColors(rgbPrimaryColor)
}

function setColors (rgbPrimaryColor) {
  const rgbDarkerColor = rgbPrimaryColor.map(value => Math.round(value * 0.8))
  const rgbLighterColor = rgbPrimaryColor.map(value => Math.round(value * 1.2))

  setColor('--bs-primary', rgbPrimaryColor)
  setColor('--bs-primary-darker', rgbDarkerColor)
  setColor('--bs-primary-lighter', rgbLighterColor)
}

function setColor (style, colorArray) {
  document.body.style.setProperty(`${style}-rgb`, colorArray.join())
  document.body.style.setProperty(style, formatRGB(colorArray))
}