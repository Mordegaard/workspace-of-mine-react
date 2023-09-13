import React from 'react'

import { Telegram } from 'scripts/components/TopBar/Settings/Social/Telegram'
import { TelegramButton } from 'scripts/components/TopBar/Settings/Social/Telegram/TelegramButton'
import { List } from 'scripts/components/TopBar/Settings/Social/List'

export function Social () {
  return <div>
    <Telegram
      trigger={<TelegramButton />}
    />
    <List />
  </div>
}