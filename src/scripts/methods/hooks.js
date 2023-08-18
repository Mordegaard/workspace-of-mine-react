import { useEffect, useState } from 'react'

export function useBlurHook (containerRef, callback) {
  if (typeof callback !== 'function') {
    throw Error(`Callback must be a function. Provided: ${typeof callback}`)
  }

  const clickHandler = (e) => {
    if (e.composedPath().includes(containerRef.current)) return

    callback()
  }

  return useEffect(() => {
    document.body.addEventListener('click', clickHandler)

    return () => {
      document.body.removeEventListener('click', clickHandler)
    }
  }, [])
}

export function useResizeHook (breakpoint, trueWideCallback = null, falseNarrowCallback = null) {
  const comparingFunction = () => typeof breakpoint === 'function'
    ? breakpoint(window.innerWidth)
    : window.innerWidth > breakpoint

  const [ breakpointReached, setBreakpointReached ] = useState(!comparingFunction())

  const resizeHandler = (e) => {
    if (comparingFunction()) {
      setBreakpointReached(false)
      trueWideCallback?.(e)
    } else {
      setBreakpointReached(true)
      falseNarrowCallback?.(e)
    }
  }

  useEffect(() => {
    resizeHandler()

    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return [ breakpointReached ]
}
