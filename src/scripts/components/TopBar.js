import React from 'react'

import { Settings } from 'scripts/components/TopBar/Settings'

export function TopBar () {
  return <div className='row g-0 w-100 p-2'>
    <div className='col' />
    <div className='col-auto'>
      <Settings
        trigger={
          <button className='icon-button text-white'>
            <i className="bi bi-gear p-1" />
          </button>
        }
      />
    </div>
  </div>
}