import React from 'react'

import { TelegramButton } from 'scripts/components/TopBar/Settings/Social/Telegram/TelegramButton'
import { List } from 'scripts/components/TopBar/Settings/Social/List'
import { sourceDescriptions } from 'scripts/methods/social/constants'

export function Social ({ router }) {
  return <div>
    <div className='row g-0'>
      <div className='col-auto me-2'>
        <TelegramButton onClick={ () => router.to('telegram') }/>
      </div>
      <div className='col-auto me-2'>
        <button disabled className='btn btn-tumblr'>
          { React.createElement(sourceDescriptions.tumblr.icon, { className: 'align-baseline me-2' }) }
          <strike>Увійти в tumblr</strike>
        </button>
      </div>
    </div>
    <div className='row g-0 my-3'>
      <div className='col'>
        <button className='link-button ' onClick={ () => router.to('layout') }>
          <i className='bi bi-columns-gap me-2' />
          Налаштувати зовнішній вигляд
        </button>
      </div>
    </div>
    <List />
  </div>
}

Social.ROUTE_NAME = 'Соціальні функції'