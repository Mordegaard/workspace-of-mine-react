import { TelegramClient, sessions } from 'scripts/providers/telegram'
import { Credentials } from 'scripts/methods/storage'

const API_ID   = 17233179
const API_HASH = '7d47a4ea84a519a2051ad68a179bcf33'

class TelegramControllerInstance {
  constructor (session, apiId, apiHash) {
    this.connected = false

    this.session = session ?? new sessions.StringSession('')
    this.apiId = apiId ?? API_ID
    this.apiHash = apiHash ?? API_HASH

    this.client = new TelegramClient(
      this.session,
      this.apiId,
      this.apiHash,
      { connectionRetries: 5 }
    )
  }

  async awaitConnection () {
    if (this.connected) return this.connected

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
    await Credentials.remove('telegram_session')
  }
}

export const TelegramController = new TelegramControllerInstance()