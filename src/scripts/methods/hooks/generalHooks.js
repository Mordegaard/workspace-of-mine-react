import { useEffect, useState } from 'react'
import Events from 'scripts/methods/events'

export function useBlurHook (containerRef, callback, deps = []) {
  const handleClick = (e) => {
    const element = containerRef instanceof HTMLElement ? containerRef : containerRef?.current

    if (element == null || e.composedPath().includes(element)) return

    callback()
  }

  const handleEsc = (e) => {
    e.key === 'Escape' && callback()
  }

  return useEffect(() => {
    document.body.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleEsc)

    return () => {
      document.body.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [ containerRef, ...deps ])
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

export function useCustomEvent (eventName, callback, deps = []) {
  useEffect(() => {
    Events.on(eventName, callback)

    return () => {
      Events.off(eventName, callback)
    }
  }, deps)
}