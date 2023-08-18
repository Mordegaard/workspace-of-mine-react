import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import NotificationManager from 'scripts/methods/notificationManager'
import { Notification } from 'scripts/components/Notifications/Notification'

export function Notifications () {
  const [ notifications, setNotifications ] = useState([])

  function addNotification ({ detail: notification }) {
    NotificationManager._addNotification(notification, setNotifications)
  }

  function removeNotification (notification) {
    NotificationManager._removeNotification(notification, setNotifications)
  }

  useEffect(() => {
    NotificationManager.container.addEventListener(NotificationManager.EVENT_NAME, addNotification)

    return () => {
      NotificationManager.container.removeEventListener(NotificationManager.EVENT_NAME, addNotification)
    }
  }, [ notifications.length ])

  return <Container>
    {
      notifications.map((notification, key) =>
        <Notification
          key={key}
          notification={notification}
          onRemove={() => removeNotification(notification)}
        />
      )
    }
  </Container>
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  top: 0;
  padding: 10px;
  z-index: 99;

  @media (max-width: 768px) {
    width: 100%;
  }
`
