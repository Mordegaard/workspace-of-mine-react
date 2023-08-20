import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { withTrigger } from 'scripts/methods/withComponent'
import { TelegramController } from 'scripts/methods/telegram'
import { Modal } from 'scripts/components/ui/Modal'
import { Details } from 'scripts/components/TopBar/Settings/Social/Telegram/Details'
import { Login } from 'scripts/components/TopBar/Settings/Social/Telegram/Login'

function TelegramBase ({ sharedContext, updateSharedContext, onClose }) {
  const [ loading, setLoading ] = useState(null)

  async function getMe () {
    setLoading(true)

    if (await TelegramController.isConnected()) {
      const me = await TelegramController.client.getMe()
      updateSharedContext({ ...sharedContext, me })
    }

    setLoading(false)
  }

  useEffect(() => {
    getMe()
  }, [])

  return <Modal title='Увійти в Telegram' width='450px' onClose={onClose}>
    <TelegramIcon className='bi bi-telegram text-telegram-lighter m-2' />
    {
      !loading && <>
        {
          sharedContext.me != null
            ? <Details me={sharedContext.me} />
            : <Login onLogin={getMe} />
        }
      </>
    }
  </Modal>
}

export const Telegram = withTrigger(TelegramBase, true)

const TelegramIcon = styled('i')`
  display: block;
  text-align: center;
  font-size: 3.6rem;
  line-height: 0;
`