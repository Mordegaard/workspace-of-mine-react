import React, { useCallback } from 'react'

import debounce from 'debounce'

import { Tooltip } from 'scripts/components/ui/Tooltip'
import { AutoColorSelector } from 'scripts/components/TopBar/Settings/General/AccentColor/AutoColorSelector'
import { AUTO_ACCENT_COLOR_TYPE_GENERAL, AUTO_ACCENT_COLOR_TYPE_SATURATED } from 'scripts/methods/constants'

export function AccentColor ({ settings, updateSettings }) {
  const debounceUpdateAccentColor = useCallback(debounce(updateAccentColor, 200), [])

  function updateAccentColor (color) {
    updateSettings('accent_color.value', color)
  }

  return <>
    <div className='row g-0 align-items-center mb-2'>
      <div className='col'>
        Автоматично визначати колір акцентів
      </div>
      <div className='col-auto'>
        <div className='form-check form-switch'>
          <input
            checked={settings.accent_color.auto ?? false}
            className='form-check-input'
            type='checkbox'
            role='switch'
            onChange={({ target }) => {
              updateSettings('accent_color.auto', target.checked)
            }}
          />
        </div>
      </div>
    </div>
    {
      settings.accent_color.auto && <div className='row g-0 align-items-center'>
        <div className='col'>
          Стиль кольору
        </div>
        <div className='col-auto'>
          <div className='btn-group' role='group'>
            <AutoColorSelector type={AUTO_ACCENT_COLOR_TYPE_GENERAL} settings={settings} updateSettings={updateSettings} />
            <AutoColorSelector type={AUTO_ACCENT_COLOR_TYPE_SATURATED} settings={settings} updateSettings={updateSettings} />
          </div>
        </div>
      </div>
    }
    {
      !settings.accent_color.auto && <div className='row g-0 my-2 align-items-center'>
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
            value={settings.accent_color.value}
            onChange={({ target }) => debounceUpdateAccentColor(target.value)}
          />
        </div>
      </div>
    }
  </>
}