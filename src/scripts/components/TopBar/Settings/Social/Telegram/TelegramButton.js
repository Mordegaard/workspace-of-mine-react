import React, { useEffect } from 'react'

import { TelegramManager } from 'scripts/methods/telegram'

export function TelegramButton ({ sharedContext, updateSharedContext, ...props }) {
  async function getMe () {
    if (await TelegramManager.isConnected()) {
      const me = await TelegramManager.getProfile()
      updateSharedContext({ ...sharedContext, me })
    }
  }

  useEffect(() => {
    if (sharedContext.me == null) {
      getMe()
    }
  }, [ sharedContext.me ])

  return <button className='btn btn-telegram-darker' {...props}>
    <i className='bi bi-telegram me-2' />
    {
      sharedContext.me
        ? `Ви увійшли як ${sharedContext.me.username}`
        : 'Увійти'
    }
  </button>
}