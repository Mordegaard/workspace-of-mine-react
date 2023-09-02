import React from 'react'

import RedditIcon from 'assets/icons/reddit.svg'
import TelegramIcon from 'assets/icons/telegram.svg'

export const SOURCE_REDDIT = 'reddit'
export const SOURCE_TELEGRAM = 'telegram'

export const sourceDescriptions = {
  [SOURCE_REDDIT]: {
    name: 'Reddit',
    placeholder: 'r/subreddit',
    color: 'var(--bs-reddit)',
    icon: <RedditIcon/>,
  },
  [SOURCE_TELEGRAM]: {
    name: 'Telegram',
    placeholder: 't.me/channel',
    color: 'var(--bs-telegram)',
    icon: <TelegramIcon/>,
  }
}