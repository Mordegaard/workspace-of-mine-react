import AbstractFetch from 'scripts/methods/abstractFetch'
import CacheManager from 'scripts/methods/cache'
import { PEXELS_BASE } from 'scripts/methods/social/constants'

/**
 * @typedef {object} PexelsSearchParams
 * @property {'landscape'|'portrait'|'square'} [orientation]
 * @property {'large'|'medium'|'small'} [size]
 * @property {string} [color]
 * @property {string} [locale]
 * @property {Number} [page]
 * @property {Number} [per_page]
 */

/**
 * @class PexelsControllerInstance
 */
class PexelsControllerInstance extends AbstractFetch {
  constructor () {
    super()

    this.url = PEXELS_BASE

    /** @type PexelsSearchParams */
    this.defaultOptions = {
      orientation: 'landscape',
      per_page: 15
    }

    this.defaultHeaders = {
      'Authorization': process.env.PEXELS_API_KEY
    }

    this.randomSearchStrings = ['mountains', 'sky', 'city', 'forest', 'sea', 'beach', 'sunset']
  }

  async curated () {
    let photos = await CacheManager.get(`pexels/curated/`, 'json')

    if (photos == null) {
      ({ photos } = await this.get('curated'))

      CacheManager.put(`pexels/curated/`, photos)
    }

    return photos
  }

  /**
   * @param {string} [string]
   * @param {PexelsSearchParams} [params]
   */
  async search (string, params = {}) {
    let photos = await CacheManager.get(`pexels/search/${encodeURIComponent(string || 'random')}`, CacheManager.TYPE_JSON)

    if (photos == null) {
      const mergedParams = { ...this.defaultOptions, ...params, query: string || this.randomSearchStrings.pickRandom() }

      ;({ photos } = await this.get('search', mergedParams))

      CacheManager.put(`pexels/search/${encodeURIComponent(string || 'random')}`, photos)
    }

    return photos
  }
}

export const PexelsController = new PexelsControllerInstance()