import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { TelegramManager } from 'scripts/methods/telegram'
import { Details } from 'scripts/components/TopBar/Settings/Social/Telegram/Details'
import { Login } from 'scripts/components/TopBar/Settings/Social/Telegram/Login'
import { useContextLoader } from 'scripts/methods/hooks'

export function Telegram ({ router }) {
  const { isLoading, throughLoading } = useContextLoader({ base: true })

  const [ me, setMe ] = useState(null)

  function getMe () {
    return throughLoading(async () => {
      if (await TelegramManager.isConnected()) {
        const me = await TelegramManager.getProfile()
        setMe(me)
      }
    })
  }

  async function logout () {
    await TelegramManager.logout()
    router.back()
  }

  useEffect(() => {
    getMe()
  }, [])

  return <div>
    <TelegramIcon className='bi bi-telegram text-telegram m-2' />
    {
      !isLoading() && <>
        {
          me != null
            ? <Details me={me} onLogout={logout} />
            : <Login onLogin={getMe} />
        }
      </>
    }
  </div>
}

Telegram.ROUTE_NAME = 'Telegram-акаунт'

const TelegramIcon = styled('i')`
  display: block;
  text-align: center;
  font-size: 3.6rem;
  line-height: 0;
`