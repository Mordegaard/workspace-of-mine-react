import React, { useEffect } from 'react'

import styled, { keyframes } from 'styled-components'

import NotificationManager from 'scripts/methods/notificationManager'

/**
 *
 * @param {AppNotification} notification
 * @param {function} onRemove
 * @return {JSX.Element}
 * @constructor
 */
export function Notification ({ notification, onRemove }) {
  useEffect(() => {
    if (notification.delay > 0) {
      setTimeout(onRemove, notification.delay)
    }
  }, [])

  return <NotificationContainer>
    <div className="row gx-1">
      <div className="col-1">
        <NotificationSign type={notification.type} className='flexed'>
          {
            types[notification.type].icon
          }
        </NotificationSign>
      </div>
      <div className="col-10 py-2">
        <div className="ps-2">
          { notification.message }
        </div>
      </div>
      <div className="col-1">
        <button className='icon-button' onClick={onRemove}>
          <i className='bi bi-x' />
        </button>
      </div>
    </div>
  </NotificationContainer>
}

const types = {
  [NotificationManager.TYPE_ERROR]: {
    color: 'var(--bs-pastel-red-200)',
    icon: <i className="bi bi-exclamation-triangle" />
  },
  [NotificationManager.TYPE_INFO]: {
    color: 'var(--bs-primary)',
    icon: <i className="bi bi-info-circle" />
  },
  [NotificationManager.TYPE_SUCCESS]: {
    color: 'var(--bs-pastel-green-200)',
    icon: <i className="bi bi-check2-circle" />
  }
}

const appearing = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
`

const NotificationContainer = styled('div')`
  width: 450px;
  max-width: 100%;
  margin: 1rem 10px 0 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 16px -8px #00000080, 2px 2px 8px -4px #00000040;
  color: #666;
  line-height: 1.2;
  float: right;
  animation: ${appearing} 0.5s ease;
  overflow: hidden;
`

const NotificationSign = styled('div')`
  height: 100%;
  color: white;
  font-size: 16px;

  ${({ type }) => `
    background-color: ${type ? types[type].color : types[NotificationManager.TYPE_INFO].color};
  `}
`