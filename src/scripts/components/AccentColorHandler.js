import { useEffect } from 'react'
import { formatRGB, extractAccentColors, hexToRgb } from 'scripts/methods/colors'
import { useCustomEvent } from 'scripts/methods/hooks'
import { DEFAULT_SETTINGS, Settings } from 'scripts/methods/storage'

export function AccentColorHandler () {
  useCustomEvent(
    ['settings:accent_color:update', 'settings:auto_accent_color:update', 'settings:wallpaper:update'],
    initColors
  )

  useCustomEvent('wallpaper:fetched', onWallpaperFetched)

  useEffect(() => {
    initColors()
  }, [])

  return null
}

async function onWallpaperFetched ({ detail: photo }) {
  const isAuto = await Settings.get('auto_accent_color')

  if (!isAuto) return
  if (!photo) return initColors()

  const extractedColors = await extractAccentColors(photo.src.tiny)
  const rgbPrimaryColor = hexToRgb(extractedColors.saturated)

  setColors(rgbPrimaryColor)
}

async function initColors () {
  const settings = { ...DEFAULT_SETTINGS, ...await Settings.get() }
  const { accent_color: accentColor, auto_accent_color: isAuto } = settings

  let rgbPrimaryColor

  if (isAuto) {
    const extractedColors = await extractAccentColors(settings.wallpaper)
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