import React from 'react'
import ReactDOM from 'react-dom/client'

import 'styles/index.scss'
import 'scripts/methods/helpers'

import { Layout } from 'scripts/components/Layout'
import { Notifications } from 'scripts/components/Notifications'
import { Provider } from 'scripts/components/Context'
import { SocialController } from 'scripts/methods/social'
import Settings from 'scripts/methods/settings'
import { requestPersistentStorage } from 'scripts/methods/indexedDb'

const root = ReactDOM.createRoot(document.getElementById('root'))

requestPersistentStorage()

Settings.init().then(() => {
  SocialController.init().then(() => {
    root.render(
      <Provider>
        <Layout />
        <Notifications />
      </Provider>,
    )
  })
})
