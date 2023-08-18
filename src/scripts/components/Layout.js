import React from 'react'

import { TopBar } from 'scripts/components/TopBar'
import { Main } from 'scripts/components/Main'
import { Social } from 'scripts/components/Social'

export function Layout () {
  return <div>
    <TopBar />
    <Main />
    <Social />
  </div>
}
