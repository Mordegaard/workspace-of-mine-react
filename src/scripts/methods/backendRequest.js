import SimpleCrypto from 'simple-crypto-js'

import Storage from 'scripts/methods/storage'

import { contextModifier } from 'scripts/components/Context'

const crypto = new SimpleCrypto(process.env.BACKEND_KEY)

export default async function backendRequest (url, method = 'GET', params = {}, modifyContext = true) {
  const tokens = Storage.local.get('tokens')
  let { headers = {}, ...parameters } = params

  headers = {
    ...headers,
    'Content-Type': 'application/json'
  }

  if (tokens) {
    try {
      headers['Authorization'] = `Bearer ${crypto.encrypt(crypto.decrypt(tokens).auth_token)}`
    } catch (e) {}
  }

  if (typeof parameters.body === 'object') {
    parameters.body = JSON.stringify(parameters.body)
  }

  const res = await fetch(process.env.BACKEND_BASE + url, {
    method,
    headers,
    ...parameters
  })

  const contentType = res.headers.get("content-type")
  const isJson = contentType && contentType.indexOf("application/json") !== -1

  const parsed = isJson ? await res.json() : await res.text()

  if (!isJson && !res.ok) {
    throw new Error(parsed)
  }

  if (modifyContext && !res.ok && res.status === 403) {
    contextModifier.logout()
  }

  return parsed
}
