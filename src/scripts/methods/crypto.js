import SimpleCrypto from 'simple-crypto-js'

const crypto = new SimpleCrypto(process.env.BACKEND_KEY)

export default class CryptoExtender {
  static encrypt (data) {
    return crypto.encrypt(data)
  }

  static decrypt (data, fallback) {
    try {
      return crypto.decrypt(data)
    } catch (e) {
      if (fallback !== undefined) {
        return fallback
      }

      throw e
    }
  }
}