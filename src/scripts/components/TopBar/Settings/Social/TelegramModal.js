import React, { useState } from 'react'

import styled from 'styled-components'

import { withTrigger } from 'scripts/methods/factories'
import { TelegramManager } from 'scripts/methods/telegram'
import { Modal } from 'scripts/components/ui/Modal'
import { Details } from 'scripts/components/TopBar/Settings/Social/Telegram/Details'
import { Login } from 'scripts/components/TopBar/Settings/Social/Telegram/Login'

function TelegramBase ({ sharedContext, updateSharedContext, onClose }) {
  const [ loading, setLoading ] = useState(false)

  async function getMe () {
    setLoading(true)

    if (await TelegramManager.isConnected()) {
      const me = TelegramManager.getProfile()
      updateSharedContext({ ...sharedContext, me })
    }

    setLoading(false)
  }

  async function logout () {
    await TelegramManager.logout()

    delete sharedContext.me

    updateSharedContext({ ...sharedContext })
  }

  return <Modal title='Увійти в Telegram' width='450px' onClose={onClose}>
    <TelegramIcon className='bi bi-telegram text-telegram m-2' />
    {
      !loading && <>
        {
          sharedContext.me != null
            ? <Details me={sharedContext.me} onLogout={logout} />
            : <Login onLogin={getMe} />
        }
      </>
    }
  </Modal>
}

export const TelegramModal = withTrigger(TelegramBase, true)

const TelegramIcon = styled('i')`
  display: block;
  text-align: center;
  font-size: 3.6rem;
  line-height: 0;
`