function componentToHex(c) {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export function hexToRgb (hex) {
  hex = hex.replace(/^#/, '')

  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return [ r, g, b ]
}

export function rgbToHex([r, g, b]) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export function formatHSL (array = []) {
  if (!Array.isArray(array)) return null

  return `hsla(${array[0] || 0}deg, ${array[1] || 0}%, ${array[2] || 0}%, ${array[3] ?? 1})`
}

export function formatRGB (array = []) {
  if (!Array.isArray(array)) return null

  return `rgba(${array.join(', ')})`
}