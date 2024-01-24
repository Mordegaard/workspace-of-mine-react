import React, { useCallback } from 'react'

import debounce from 'debounce'

import { Tooltip } from 'scripts/components/ui/Tooltip'

export function AccentColor ({ settings, updateSettings }) {
  const debounceUpdateAccentColor = useCallback(debounce(updateAccentColor, 200), [])

  function updateAccentColor (color) {
    updateSettings('accent_color', color)
  }

  return <>
    <div className='row g-0 align-items-center'>
      <div className='col'>
        Автоматично визначати колір акцентів
      </div>
      {
        settings.auto_accent_color && <div className='col-auto'>

        </div>
      }
      <div className='col-auto'>
        <div className='form-check form-switch'>
          <input
            checked={settings.auto_accent_color ?? false}
            className='form-check-input'
            type='checkbox'
            role='switch'
            onChange={({ target }) => {
              updateSettings('auto_accent_color', target.checked)
            }}
          />
        </div>
      </div>
    </div>
    {
      !settings.auto_accent_color && <div className='row g-0 align-items-center'>
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
    }
  </>
}