import React from 'react'
import ReactDOM from 'react-dom/client'

import 'styles/index.scss'
import 'scripts/methods/helpers'

import { Layout } from 'scripts/components/Layout'
import { Notifications } from 'scripts/components/Notifications'
import { Provider } from 'scripts/components/Context'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider>
    <Layout />
    <Notifications />
  </Provider>,
)
