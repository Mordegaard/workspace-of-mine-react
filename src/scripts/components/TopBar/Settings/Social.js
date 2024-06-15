import React from 'react'

import { TelegramButton } from 'scripts/components/TopBar/Settings/Social/Telegram/TelegramButton'
import { List } from 'scripts/components/TopBar/Settings/Social/List'

export function Social ({ router }) {
  return <div>
    <TelegramButton onClick={() => router.to('telegram')} />
    <List/>
  </div>
}

Social.ROUTE_NAME = 'Соціальні функції'