import React, { useState } from 'react'

import { useCustomEvent } from 'scripts/methods/hooks'

export function withTrigger (component, useContext = false) {
  // eslint-disable-next-line react/display-name
  return ({ trigger, disabled = false, ...props }) => {
    const [ visible, setVisible ] = useState(false)
    const [ sharedContext, setSharedContext ] = useState({})

    const contextProps = useContext
      ? { sharedContext, updateSharedContext: setSharedContext }
      : {}

    return <>
      {
        React.cloneElement(
          trigger,
          {
            ...contextProps,
            ...(disabled ? {} : {onClick: setVisible.bind(null, true)}),
          }
        )
      }
      {
        visible && React.createElement(
          component,
          {
            ...props,
            ...contextProps,
            onClose: setVisible.bind(null, false),
          }
        )
      }
    </>
  }
}

export function withCustomEvent (component, eventName) {
  // eslint-disable-next-line react/display-name
  return (props = {}) => {
    const [ visible, setVisible ] = useState(false)
    const [ eventData, setEventData ] = useState(null)

    useCustomEvent(eventName, ({ detail = null }) => {
      setVisible(true)
      setEventData(detail)
    })

    return visible && React.createElement(
      component,
      {
        ...props,
        eventData,
        onClose: setVisible.bind(null, false),
      }
    )
  }
}