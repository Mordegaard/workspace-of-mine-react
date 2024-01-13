import React, { useCallback } from 'react'

import debounce from 'debounce'

import Events from 'scripts/methods/events'
import { Tooltip } from 'scripts/components/ui/Tooltip'
import { SocialLayout } from 'scripts/components/TopBar/Settings/General/SocialLayout'

export function General ({ settings, updateSettings }) {
  const debounceUpdateAccentColor = useCallback(debounce(updateAccentColor, 200), [])

  async function updateAccentColor (color) {
    Events.trigger('settings:accent_color:update', color)
    await updateSettings('accent_color', color)
  }

  return <div>
    <div className='row g-0 align-items-center'>
      <div className='col'>
        Колір акцентів
      </div>
      <div className='col-auto'>
        <Tooltip content='Скинути колір до початкового'>
          <button
            className='icon-button text-gray-500 danger me-2'
            onClick={updateAccentColor.bind(null, null)}
          >
            <i className='bi bi-trash p-1' />
          </button>
        </Tooltip>
      </div>
      <div className='col-auto'>
        <input
          type='color'
          className='form-control form-control-color'
          value={settings.accent_color}
          onChange={({ target }) => debounceUpdateAccentColor(target.value)}
        />
      </div>
    </div>
    <SocialLayout settings={settings} updateSettings={updateSettings} />
  </div>
}