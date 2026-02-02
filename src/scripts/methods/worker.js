export function postWorkerMessage(type, data) {
  return new Promise((resolve) => {
    const id = window.crypto.randomUUID()

    const onResponse = (event) => {
      if (event.data.id === id) {
        resolve(event.data)
        unsubscribe()
      }
    }

    const unsubscribe = () => {
      navigator.serviceWorker.removeEventListener('message', onResponse)
      resolve(null)
    }

    const subscribe = () => {
      navigator.serviceWorker.addEventListener('message', onResponse)
      setTimeout(unsubscribe, TIMEOUT)
    }

    subscribe()

    navigator.serviceWorker.controller.postMessage({
      id,
      type,
      data
    })
  })
}

const TIMEOUT = 1000