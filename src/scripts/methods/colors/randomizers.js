import { random } from 'scripts/methods/helpers'
import { COLORS } from 'scripts/methods/constants'

export function randomColor (seed = null) {
  let index

  if (seed) {
    index = String(seed)
      .split('')
      .map(letter => letter.charCodeAt(0))
      .reduce((a, b) => a + b, 0) % COLORS.length
  } else {
    index = random(COLORS.length)
  }

  return COLORS[index]
}