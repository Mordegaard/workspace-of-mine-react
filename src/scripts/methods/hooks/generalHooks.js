import { useEffect, useRef, useState } from 'react'
import Events from 'scripts/methods/events'

export function useBlurHook (containerRef, callback, deps = [], conditionCallback = null) {
  const handleClick = (e) => {
    const element = containerRef instanceof HTMLElement ? containerRef : containerRef?.current
    const composedPath = e.composedPath()

    if (element == null
      || composedPath.includes(element)
      || composedPath.some(element => element.classList?.contains('blur-ignored'))
    ) {
      return
    }

    callback(e)
  }

  const handleEsc = (e) => {
    e.key === 'Escape' && callback(e)
  }

  return useEffect(() => {
    if (typeof conditionCallback !== 'function' || conditionCallback?.()) {
      document.body.addEventListener('mousedown', handleClick)
      window.addEventListener('keydown', handleEsc)
    }

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

export function useCustomEvent (eventNames, callback, deps = []) {
  useEffect(() => {
    const events = Array.isArray(eventNames) ? eventNames : [eventNames]

    events.forEach(eventName => {
      Events.on(eventName, callback)
    })

    return () => {
      events.forEach(eventName => {
        Events.off(eventName, callback)
      })
    }
  }, deps)
}

export function useDidUpdateEffect(callback, deps) {
  const isMountingRef = useRef(false)

  useEffect(() => {
    isMountingRef.current = true
  }, [])

  useEffect(() => {
    if (!isMountingRef.current) {
      return callback()
    } else {
      isMountingRef.current = false
    }
  }, deps)
}