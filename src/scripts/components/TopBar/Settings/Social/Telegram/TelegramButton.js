import React, { useEffect } from 'react'

import { TelegramController } from 'scripts/methods/telegram'

export function TelegramButton ({ sharedContext, updateSharedContext, ...props }) {
  async function getMe () {
    if (await TelegramController.isConnected()) {
      const me = await TelegramController.client.getMe()
      updateSharedContext({ ...sharedContext, me, getMe })
    }
  }

  useEffect(() => {
    if (sharedContext.me == null) {
      getMe()
    }
  }, [])

  return <button className='btn btn-telegram-darker' {...props}>
    <i className='bi bi-telegram me-2' />
    {
      sharedContext.me
        ? `Ви увійшли як ${sharedContext.me.username}`
        : 'Увійти'
    }
  </button>
}