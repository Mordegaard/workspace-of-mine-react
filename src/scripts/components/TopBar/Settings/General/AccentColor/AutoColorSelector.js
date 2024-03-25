import React from 'react'

import styled, { css } from 'styled-components'

import SettingsManager from 'scripts/methods/settings'
import { hexToRgb, rgbToHex, multiply } from 'scripts/methods/colors'

export function AutoColorSelector ({ type, settings, updateSettings, ...props }) {
  const active = type === settings.accent_color.auto_type

  return <Button
    {...props}
    $color={SettingsManager.context.accent_colors?.[type]}
    onClick={() => {
      updateSettings('accent_color.auto_type', type)
    }}
  >
    { active ? <i className='bi bi-check2-circle' /> : <i className='bi bi-circle' /> }
  </Button>
}

const getButtonStyles = (color) => {
  const rgb = hexToRgb(color)
  const [ r, g, b ] = rgb
  const lightness = r * 0.58 + g * 0.31 + b * 0.11

  const brighter = rgbToHex(multiply(rgb, 1.2))
  const darker = rgbToHex(multiply(rgb, 0.8))

  const text = lightness > 128 ? 'black' : 'white'

  return css`
    --bs-btn-bg: ${color};
    --bs-btn-border-color: ${color};
    --bs-btn-hover-bg: ${darker};
    --bs-btn-hover-border-color: ${darker};
    --bs-btn-active-bg: ${brighter};
    --bs-btn-active-border-color: ${brighter};
    --bs-btn-hover-color: ${text};
    --bs-btn-color: ${text};
  `
}

const Button = styled('button').attrs({ className: 'btn' })`
  ${({ $color }) => getButtonStyles($color)}
`