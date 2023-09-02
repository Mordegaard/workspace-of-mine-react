import { SocialSources } from 'scripts/methods/storage'
import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/socialSources/constants'
import Events from 'scripts/methods/events'
import SocialSourceValidator from 'scripts/methods/socialSources/socialSourceValidator'
import SocialPosts from 'scripts/methods/socialSources/posts/SocialPosts'

class SocialSourcesControllerInstance {
  constructor () {
    this.validator = SocialSourceValidator

    this.types = [
      SOURCE_TELEGRAM,
      SOURCE_REDDIT
    ]

    this.posts = new SocialPosts(this)
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
      this.posts.getAllPosts()
    }

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

export const SocialSourcesController = new SocialSourcesControllerInstance()