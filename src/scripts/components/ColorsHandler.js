import { useEffect } from 'react'
import { formatRGB, extractAccentColors, hexToRgb } from 'scripts/methods/colors'
import { useCustomEvent, useSettings } from 'scripts/methods/hooks'
import SettingsManager from 'scripts/methods/settings'
import { THEME_DARK, THEME_LIGHT } from 'scripts/methods/constants'

let currentTheme = THEME_LIGHT

export function ColorsHandler () {
  const settings = useSettings()

  useCustomEvent('wallpaper:fetched', initColors)

  useEffect(() => {
    initColors()
  }, [ settings.accent_color ])

  useEffect(() => {
    initTheme()
  }, [ settings.theme ])

  return null
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', initTheme)

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

    document.documentElement.setAttribute('data-bs-theme', theme)

    currentTheme = theme

    const style = getComputedStyle(document.body)

    const keys1 = Array.range(8).map(index => `--bs-gray-${index + 1}00`)
    const values1 = keys1.map(key => style.getPropertyValue(key))
    const keys2 = Array.range(8).map(index => `--bs-gray-${index + 1}00-rgb`)
    const values2 = keys2.map(key => style.getPropertyValue(key))

    values1.reverse()
    values2.reverse()

    const keys = [ ...keys1, ...keys2 ]
    const values = [ ...values1, ...values2 ]

    keys.forEach((key, i) => {
      document.body.style.setProperty(key, values[i])
    })
  }
}

async function initColors () {
  const settings = SettingsManager.get()
  const { value: accentColor, auto, auto_type } = settings.accent_color
  const { fetched_wallpaper: fetched, stored_wallpaper_url: url } = SettingsManager.context

  let rgbPrimaryColor

  if (auto) {
    const extractFrom = fetched?.src?.tiny ?? url
    const extractedColors = await extractAccentColors(extractFrom)

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