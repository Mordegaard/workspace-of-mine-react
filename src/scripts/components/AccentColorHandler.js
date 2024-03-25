import { useEffect } from 'react'
import { formatRGB, extractAccentColors, hexToRgb } from 'scripts/methods/colors'
import { useCustomEvent } from 'scripts/methods/hooks'
import SettingsManager from 'scripts/methods/settings'

export function AccentColorHandler () {
  useCustomEvent(
    ['settings:accent_color.*:update', 'settings:wallpaper.value:update', 'wallpaper:fetched'],
    initColors
  )

  useEffect(() => {
    initColors()
  }, [])

  return null
}

async function initColors () {
  const settings = SettingsManager.get()
  const { value: accentColor, auto, auto_type } = settings.accent_color
  const { fetched_wallpaper: fetched } = SettingsManager.context

  let rgbPrimaryColor

  if (auto) {
    const extractedColors = await extractAccentColors(fetched?.src?.tiny ?? settings.wallpaper.value)

    rgbPrimaryColor = hexToRgb(extractedColors[auto_type])

    SettingsManager.context.accent_colors = extractedColors
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