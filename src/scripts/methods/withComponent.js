import React, { useState } from 'react'

export function withTrigger (component, useContext = false) {
  // eslint-disable-next-line react/display-name
  return ({ trigger, ...props }) => {
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
            onClick: setVisible.bind(null, true),
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