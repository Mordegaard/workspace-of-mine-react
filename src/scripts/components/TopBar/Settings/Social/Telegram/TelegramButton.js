import React, { useEffect, useState } from 'react'

import { TelegramManager } from 'scripts/methods/telegram'

export function TelegramButton ({ ...props }) {
  const [ me, setMe ] = useState(null)

  async function getMe () {
    if (await TelegramManager.isConnected()) {
      const me = await TelegramManager.getProfile()
      setMe(me)
    }
  }

  useEffect(() => {
    getMe()
  }, [])

  return <button className='btn btn-telegram text-white' {...props}>
    <i className='bi bi-telegram me-2' />
    {
      me
        ? `Ви увійшли як ${me.username}`
        : 'Увійти'
    }
  </button>
}