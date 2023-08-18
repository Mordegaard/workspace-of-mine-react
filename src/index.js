import React from 'react'
import ReactDOM from 'react-dom/client'

import 'styles/index.scss'
import 'scripts/methods/helpers'

import { Layout } from 'scripts/components/Layout'
import { Notifications } from 'scripts/components/Notifications'
import { Provider } from 'scripts/components/Context'
import CacheController from 'scripts/methods/cache'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider>
    <Layout />
    <Notifications />
  </Provider>,
)

;(async () => {
  console.log(
    await CacheController.put('asd', new Blob([ '1234' ]))
  )

  console.log(
    await CacheController.get('asd', 'text')
  )
})()