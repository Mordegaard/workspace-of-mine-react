/* global telegram */

import CacheManager from 'scripts/methods/cache'
import { CredentialsStorage } from 'scripts/methods/storage'
import { MEDIA_VIDEO } from 'scripts/methods/social/constants'
import TelegramHelpers from 'scripts/methods/telegram/telegramHelpers'

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
    this.helpers = new TelegramHelpers(this)

    this.awaitConnection()
  }

  async awaitConnection () {
    if (this.connected) return this.connected

    this.session = new telegram.sessions.StringSession(await CredentialsStorage.get('telegram_session', ''))

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

      await CredentialsStorage.set('telegram_session', this.client.session.save())
    }
  }

  async logout () {
    await this.client.invoke(new telegram.Api.auth.LogOut({}))
    await CredentialsStorage.remove('telegram_session')
  }

  /**
   * @param key
   * @return {Promise<string|null>}
   */
  async fetchProfilePicture (key = 'me') {
    let blob = await CacheManager.get(`telegram/profile_picture/${key}`, 'blob')

    if (blob == null) {
      const buffer = await this.client.downloadProfilePhoto(key)

      if (buffer.length === 0) {
        return null
      }

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
   * @return {Promise<string>}
   */
  async getMedia (media, type, params = {}, progressCallback) {
    const id = String(media.photo?.id ?? media.document?.id)

    let blob = await CacheManager.get(`media/telegram/${id}`, 'blob')

    if (!blob) {
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

      blob = new Blob([ mediaBytes ], { type: mimeType ?? params.mimeType ?? 'image/png' })

      CacheManager.put(`media/telegram/${id}`, blob)
    }

    return URL.createObjectURL(blob)
  }

  async getCustomEmojis (documentIds) {
    const notFound = []
    const found = []

    for (const id of documentIds) {
      let document = await CacheManager.get(`telegram/documents/${id}`, 'json')

      if (document) {
        document.fileReference = this.helpers.arrayToBuffer(document.fileReference.data)
        document = new telegram.Api.Document(document)

        found.push(document)
      } else {
        notFound.push(id)
      }
    }

    if (notFound.length) {
      const fetched = await this.client.invoke(
        new telegram.Api.messages.GetCustomEmojiDocuments({
          documentId: notFound
        })
      )

      fetched.forEach(document => {
        if (document.mimeType === 'application/x-tgsticker') {
          document.mimeType = 'image/png'
        }

        found.push(document)

        CacheManager.put(`telegram/documents/${document.id}`, JSON.stringify(document), 1000 * 3600) // 1 hour
      })
    }

    return found
  }

  async downloadDocument (document, mimeType) {
    let blob = await CacheManager.get(`media/telegram/${document.id}`, 'blob')

    let thumbSize = ''

    if (document.mimeType.includes('image')) {
      thumbSize = document.thumbs?.at(-1)?.type ?? ''
    }

    if (!blob) {
      const params = {
        id: document.id,
        accessHash: document.accessHash,
        fileReference: document.fileReference,
        thumbSize
      }

      const bytes = await this.client.downloadFile(
        new telegram.Api.InputDocumentFileLocation(params),
      )

      blob = new Blob([ bytes ], { type: mimeType ?? document.mimeType })

      CacheManager.put(`media/telegram/${document.id}`, blob)
    }

    return URL.createObjectURL(blob)
  }
}

export const TelegramManager = new TelegramManagerInstance()