import React from 'react'

import { SocialSources } from 'scripts/methods/storage'
import Events from 'scripts/methods/events'
import SocialSourceValidator from 'scripts/methods/socialSources/socialSourceValidator'
import RedditService from 'scripts/methods/socialSources/Reddit'

import RedditIcon from 'assets/icons/reddit.svg'
import TelegramIcon from 'assets/icons/telegram.svg'

export const SOURCE_REDDIT   = 'reddit'
export const SOURCE_TELEGRAM = 'telegram'

class SocialSourcesControllerInstance {
  constructor () {
    this.columns = 3
    this.validator = SocialSourceValidator
    this.items     = this._resetItems()

    this.types = [
      SOURCE_TELEGRAM,
      SOURCE_REDDIT
    ]

    this.reddit = new RedditService(this)
  }

  /**
   * @private
   */
  _resetItems () {
    return [ ...new Array(this.columns) ].map(() => [])
  }

  /**
   * @param {SocialSource[]} sources
   * @param {boolean} fetch
   * @return {Promise<SocialSource[]>}
   * @private
   */
  async _updateAll (sources, fetch = false) {
    await SocialSources.set('items', sources)

    Events.trigger('sources:updated', sources)

    if (fetch) {
      this.items = this._resetItems()
      this.fetchAllPosts()
    }

    return sources
  }

  async fetchAllPosts () {
    this.types.forEach(type => {
      this[type]?.getAllPosts()
    })
  }

  /**
   * @param {FormattedPost[]} posts
   */
  appendPosts (posts = []) {
    const divideCount = Math.floor(posts.length / this.columns)

    this.items.forEach(array => {
      array.push(...posts.splice(0, divideCount))
    })

    const heights = [ ...document.getElementsByClassName('social-column') ]
      .map(element => element.offsetHeight)

    if (heights[0]) {
      const maxHeightColumnLastPost = this.items[heights.indexOf(Math.max(...heights))].pop()
      this.items[heights.indexOf(Math.min(...heights))].push(maxHeightColumnLastPost)
    }

    Events.trigger('posts:updated')
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

    return this._updateAll(sources, true)
  }

  /**
   * @return {Promise<SocialSource[]>}
   */
  async remove (key) {
    const sources = (await this.get())
      .filter(source => source.key !== key)

    return this._updateAll(sources, true)
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