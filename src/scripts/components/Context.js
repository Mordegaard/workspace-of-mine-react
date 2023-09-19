import React, { useState } from 'react'

export const GeneralContext = React.createContext()

export function Provider ({ children }) {
  const [ context, setContext ] = useState({
    showAddBookmarkButton: true
  })

  function updateContext (values = {}) {
    setContext({ ...context, ...values })
  }

  return <GeneralContext.Provider
    value={{
      ...context,
      updateContext,
    }}
  >
    { children }
  </GeneralContext.Provider>
}
