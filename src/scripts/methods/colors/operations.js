export function modifyColor (color = [], modifier = []) {
  if (!(Array.isArray(color) && Array.isArray(modifier))) {
    return null
  }

  return color.map((value, index) => value + modifier[index] ?? 0)
}

export function mixRGB (col1, col2, power1) {
  const power2 = 1 - power1

  const [ x1, y1, z1 ] = col1
  const [ x2, y2, z2 ] = col2

  return [ x1 * power1 + x2 * power2, y1 * power1 + y2 * power2, z1 * power1 + z2 * power2 ]
}

export function mixHSL (col1, col2, power1) {
  const power2 = 1 - power1

  const x1 = Math.cos(col1[0] / 180 * Math.PI) * col1[1]
  const y1 = Math.sin(col1[0] / 180 * Math.PI) * col1[1]
  const z1 = col1[2]

  const x2 = Math.cos(col2[0] / 180 * Math.PI) * col2[1]
  const y2 = Math.sin(col2[0] / 180 * Math.PI) * col2[1]
  const z2 = col2[2]

  const x = x1 * power1 + x2 * power2
  const y = y1 * power1 + y2 * power2
  const z = z1 * power1 + z2 * power2

  return [ Math.atan2(y, x) * 180 / Math.PI, Math.sqrt(x * x + y * y), z ]
}