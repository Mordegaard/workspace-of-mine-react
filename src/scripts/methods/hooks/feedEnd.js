import { useCallback } from 'react'
import debounce from 'debounce'

/**
 * @param {function} callback
 * @param {Array} [deps]
 */
export function useFeedEnd (callback, deps = []) {
  const scrollHandle = (...params) => {
    const bottoms = [ ...document.getElementsByClassName('social-column') ]
      .map(element => element.getBoundingClientRect().bottom - window.innerHeight)

    if (bottoms.some(bottom => bottom < THRESHOLD)) {
      callback(...params)
    }
  }

  return useCallback(debounce(scrollHandle, DEBOUNCE_DELAY), deps)
}

const DEBOUNCE_DELAY = 250
const THRESHOLD = 400