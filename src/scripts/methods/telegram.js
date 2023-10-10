/* global telegram */

import { Credentials } from 'scripts/methods/storage'
import CacheManager from 'scripts/methods/cache'
import { MEDIA_VIDEO } from 'scripts/methods/social/constants'

const API_ID   = 17233179
const API_HASH = '7d47a4ea84a519a2051ad68a179bcf33'

class TelegramManagerInstance {
  constructor (session, apiId, apiHash) {
    this.connected = false

    this.session = session ?? new telegram.sessions.StringSession('')
    this.apiId = apiId ?? API_ID
    this.apiHash = apiHash ?? API_HASH

    this.client = null
    this.rawClient = telegram.client

    this.awaitConnection()
  }

  async awaitConnection () {
    if (this.connected) return this.connected

    this.session = new telegram.sessions.StringSession(await Credentials.get('telegram_session', ''))

    this.client = new telegram.TelegramClient(
      this.session,
      this.apiId,
      this.apiHash,
      { connectionRetries: 5 }
    )

    await this.client.connect()

    this.connected = true

    return this.connected
  }

  async isConnected () {
    return this.client.checkAuthorization()
  }

  async login (phoneNumberCallback, phoneCodeCallback, passwordCallback, errorCallback) {
    if (!await this.isConnected()) {
      await this.client.start({
        phoneNumber: phoneNumberCallback,
        phoneCode: phoneCodeCallback,
        password: passwordCallback,
        onError: errorCallback
      })

      await Credentials.set('telegram_session', this.client.session.save())
    }
  }

  async logout () {
    await this.client.invoke(new telegram.Api.auth.LogOut({}))
    await Credentials.remove('telegram_session')
  }

  async getProfilePicture (key = null) {
    if (key == null) {
      key = 'me'
    }

    let blob = await CacheManager.get(`telegram/profile_picture/${key}`, 'blob')

    if (blob == null) {
      const buffer = await this.client.downloadProfilePhoto(key)

      blob = new Blob([ buffer ], { type: 'image/png' })

      await CacheManager.put(`telegram/profile_picture/${key}`, blob)
    }

    return URL.createObjectURL(blob)
  }

  async getProfile () {
    let me = await CacheManager.get('telegram/me', 'json')

    if (!me) {
      me = await this.client.getMe()
      await CacheManager.put('telegram/me', JSON.stringify(me))
    }

    return me
  }

  async getChannelMessages (username, params) {
    const parameters = {
      limit: 10,
      position: 0,
      ...params,
    }

    return this.client.invoke(
      new telegram.Api.messages.GetHistory({
        peer: username,
        limit: parameters.limit,
        addOffset: parameters.position,
      })
    )
  }

  /**
   * @param {Object} media
   * @param {('photo'|'video')} type
   * @param {Object} params
   * @param {function?} progressCallback
   * @return {Promise<module:buffer.Blob>}
   */
  async getMedia (media, type, params = {}, progressCallback) {
    const parameters = type === MEDIA_VIDEO
      ? params
      : { thumb: media.photo?.sizes.findIndex(({ type }) => type === 'x'), ...params }

    const mimeType = type === MEDIA_VIDEO
      ? media.document.mimeType
      : null

    const mediaBytes = await this.client.downloadMedia(
      media,
      {
        workers: 4,
        progressCallback,
        ...parameters
      }
    )

    return new Blob([ mediaBytes ], { type: mimeType ?? params.mimeType ?? 'image/png' })
  }
}

export const TelegramManager = new TelegramManagerInstance()