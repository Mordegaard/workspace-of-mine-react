export default async function backendRequest (url, method = 'GET', params = {}) {
  let { headers = {}, ...parameters } = params

  headers = {
    ...headers,
    'Content-Type': 'application/json'
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

  return parsed
}
