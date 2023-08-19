import React, { useState } from 'react'

export function withTrigger (component) {
  // eslint-disable-next-line react/display-name
  return ({ trigger, ...props }) => {
    const [ visible, setVisible ] = useState(false)

    return <>
      {
        React.cloneElement(trigger, { onClick: setVisible.bind(null, true) })
      }
      {
        visible && React.createElement(component, { ...props, onClose: setVisible.bind(null, false) })
      }
    </>
  }
}