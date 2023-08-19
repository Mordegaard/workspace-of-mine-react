import React, { useEffect, useState } from 'react'

import { TelegramController } from 'scripts/methods/telegram'

export function TelegramButton () {
  const [ me, setMe ] = useState(null)

  async function getMe () {
    if (await TelegramController.isConnected()) {
      const me = await TelegramController.client.getMe()
      console.log(me)
    }
  }

  useEffect(() => {
    getMe()
  }, [])

  return <button className='btn btn-telegram'>
    <i className='bi bi-telegram me-2' />
    Увійти
  </button>
}