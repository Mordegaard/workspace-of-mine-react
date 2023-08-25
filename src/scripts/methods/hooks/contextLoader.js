import { useState } from 'react'

export function useContextLoader (initialState = { [DEFAULT_KEY]: false }) {
  const [ state, setState ] = useState(initialState)

  const isLoading = (key = DEFAULT_KEY) => state[key] === true
  const setLoading = (key = DEFAULT_KEY) => setState({ ...state, [key]: true })
  const setLoaded = (key = DEFAULT_KEY) => setState({ ...state, [key]: false })
  const throughLoading = async (callback, key = DEFAULT_KEY) => {
    setLoading(key)
    await callback()
    setLoaded(key)
  }

  return { isLoading, setLoading, setLoaded, throughLoading }
}

const DEFAULT_KEY = 'base'