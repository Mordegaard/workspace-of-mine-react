import { useEffect } from 'react'
import { formatRGB, extractAccentColors, hexToRgb } from 'scripts/methods/colors'
import { useCustomEvent } from 'scripts/methods/hooks'
import SettingsManager from 'scripts/methods/settings'
import { THEME_DARK, THEME_LIGHT } from 'scripts/methods/constants'

let currentTheme = THEME_LIGHT

export function ColorsHandler () {
  useCustomEvent(
    ['settings:accent_color.*:update', 'settings:wallpaper.value:update', 'wallpaper:fetched'],
    initColors
  )

  useCustomEvent('settings:theme:update', initTheme)

  useEffect(() => {
    initTheme()
    initColors()

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', initTheme)
  }, [])

  return null
}

function initTheme () {
  const settings = SettingsManager.get()

  let theme = settings.theme

  if (theme == null) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_DARK
      : THEME_LIGHT
  }

  if (currentTheme !== theme) {
    document.body.classList.remove(currentTheme)
    document.body.classList.add(theme)

    currentTheme = theme

    const style = getComputedStyle(document.body)

    const keys = [ '--bs-black', ...Array.range(8).map(index => `--bs-gray-${index + 1}00`), '--bs-white' ]
    const values = keys.map(key => style.getPropertyValue(key))

    values.reverse()

    keys.forEach((key, i) => {
      document.body.style.setProperty(key, values[i])
    })
  }
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