import React from 'react'

export function TelegramButton ({ sharedContext, updateSharedContext, ...props }) {
  return <button className='btn btn-telegram-darker' {...props}>
    <i className='bi bi-telegram me-2' />
    Увійти
  </button>
}