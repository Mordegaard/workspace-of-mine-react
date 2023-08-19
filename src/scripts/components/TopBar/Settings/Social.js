import React from 'react'

import { Telegram } from 'scripts/components/TopBar/Settings/Social/Telegram'
import { TelegramButton } from 'scripts/components/TopBar/Settings/Social/Telegram/TelegramButton'

export function Social () {
  return <div>
    <Telegram
      trigger={<TelegramButton />}
    />
  </div>
}