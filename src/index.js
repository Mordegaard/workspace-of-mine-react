import React from 'react'
import ReactDOM from 'react-dom/client'

import 'styles/index.scss'
import 'scripts/methods/helpers'

import { Layout } from 'scripts/components/Layout'
import { Notifications } from 'scripts/components/Notifications'
import { Provider } from 'scripts/components/Context'
import { SocialController } from 'scripts/methods/social'
import Settings from 'scripts/methods/settings'

const root = ReactDOM.createRoot(document.getElementById('root'))

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
