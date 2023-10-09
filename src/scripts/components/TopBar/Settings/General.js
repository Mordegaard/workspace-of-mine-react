import React, { useCallback } from 'react'

import debounce from 'debounce'

import { DEFAULT_ACCENT_COLOR } from 'scripts/methods/constants'
import Events from 'scripts/methods/events'

export function General ({ settings, updateSettings }) {
  const debounceUpdateAccentColor = useCallback(debounce(updateAccentColor, 200), [])

  async function updateAccentColor (color) {
    Events.trigger('settings:accent_color:update', color)
    await updateSettings('accent_color', color)
  }

  return <div>
    <div className='row g-0'>
      <div className='col'>
        Колір акцентів
      </div>
      <div className='col-auto'>
        <input
          type='color'
          className='form-control form-control-color'
          value={settings.accent_color ?? DEFAULT_ACCENT_COLOR}
          onChange={({ target }) => debounceUpdateAccentColor(target.value)}
        />
      </div>
    </div>
  </div>
}