/* global telegram */

import { Credentials } from 'scripts/methods/storage'
import CacheController from 'scripts/methods/cache'

const API_ID   = 17233179
const API_HASH = '7d47a4ea84a519a2051ad68a179bcf33'

class TelegramControllerInstance {
  constructor (session, apiId, apiHash) {
    this.connected = false

    this.session = session ?? new telegram.sessions.StringSession('')
    this.apiId = apiId ?? API_ID
    this.apiHash = apiHash ?? API_HASH

    this.client = null
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

  async sendLoginCode (phoneNumber) {
    return this.client.sendCode(
      {
        apiId: this.apiId,
        apiHash: this.apiHash
      },
      phoneNumber
    )
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

  async getProfilePicture () {
    let blob = await CacheController.get('profile_picture', 'blob')

    if (blob == null) {
      const buffer = await this.client.downloadProfilePhoto('me')

      blob = new Blob([ buffer ])

      await CacheController.put('profile_picture', blob)
    }

    return URL.createObjectURL(blob)
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
}

export const TelegramController = new TelegramControllerInstance()