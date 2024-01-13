import RedditIcon from 'assets/icons/reddit.svg'
import TelegramIcon from 'assets/icons/telegram.svg'
import TumblrIcon from 'assets/icons/tumblr.svg'

export const SOURCE_REDDIT = 'reddit'
export const SOURCE_TELEGRAM = 'telegram'
export const SOURCE_TUMBLR = 'tumblr'

export const MEDIA_IMAGE = 'image'
export const MEDIA_VIDEO = 'video'
export const MEDIA_EMBED = 'embed'

export const sourceDescriptions = {
  [SOURCE_REDDIT]: {
    name: 'Reddit',
    placeholder: 'r/subreddit',
    color: 'var(--bs-reddit)',
    icon: RedditIcon,
  },
  [SOURCE_TELEGRAM]: {
    name: 'Telegram',
    placeholder: 't.me/channel',
    color: 'var(--bs-telegram)',
    icon: TelegramIcon,
  },
  [SOURCE_TUMBLR]: {
    name: 'Tumblr',
    placeholder: 'username',
    color: 'var(--bs-tumblr)',
    icon: TumblrIcon
  }
}