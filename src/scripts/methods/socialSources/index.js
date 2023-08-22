import React from 'react'

import { SocialSources } from 'scripts/methods/storage'
import Events from 'scripts/methods/events'
import SocialSourceValidator from 'scripts/methods/socialSources/socialSourceValidator'

import RedditIcon from 'assets/icons/reddit.svg'
import TelegramIcon from 'assets/icons/telegram.svg'

/**
 * @typedef {object} SocialSource
 * @property {string} key
 * @property {('reddit'|'telegram')} type
 * @property {string?} description
 * @property {boolean} hidden
 */

class SocialSourcesControllerInstance {
  constructor () {
    this.validator = SocialSourceValidator
  }

  /**
   * @param {SocialSource[]} sources
   * @return {Promise<SocialSource[]>}
   * @private
   */
  async _updateAll (sources) {
    await SocialSources.set('items', sources)

    Events.trigger('sources:updated', sources)

    return sources
  }

  /**
   * @return {Promise<SocialSource[]>}
   */
  async get () {
    return SocialSources.get('items', [])
  }

  /**
   * @return {Promise<SocialSource[]|boolean>}
   */
  async put (key, type) {
    const sources = await this.get()

    if (!this.validator.validate({ key, type }) || sources.find(source => source.key === key)) {
      return false
    }

    sources.push({
      key,
      type,
      hidden: false
    })

    return this._updateAll(sources)
  }

  /**
   * @return {Promise<SocialSource[]>}
   */
  async remove (key) {
    const sources = (await this.get())
      .filter(source => source.key !== key)

    return this._updateAll(sources)
  }

  /**
   * @return {Promise<SocialSource[]|boolean>}
   */
  async update (key, data = {}) {
    const sources = await this.get()

    let foundSource = sources.find(source => source.key === key)

    if (foundSource == null) {
      throw new Error(`Cannot find social source with key "${key}"`)
    }

    foundSource = { ...foundSource, ...data }

    if (!this.validator.validate({ key, type: foundSource.type })) {
      return false
    }

    return this._updateAll(sources)
  }
}

const SocialSourcesController = new SocialSourcesControllerInstance()

export default SocialSourcesController

export const SOURCE_REDDIT   = 'reddit'
export const SOURCE_TELEGRAM = 'telegram'

export const sourceDescriptions = {
  [SOURCE_REDDIT]: {
    name: 'Reddit',
    placeholder: 'r/subreddit',
    color: 'var(--bs-reddit)',
    icon: <RedditIcon />,
    alternativeIcon: <i className='bi bi-reddit' />
  },
  [SOURCE_TELEGRAM]: {
    name: 'Telegram',
    placeholder: 't.me/channel',
    color: 'var(--bs-telegram-lighter)',
    icon: <TelegramIcon />,
    alternativeIcon: <i className='bi bi-telegram' />
  }
}