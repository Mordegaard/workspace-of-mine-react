import React from 'react'
import { Dropdown, Select } from 'scripts/components/ui/Dropdown'
import { THEME_DARK, THEME_LIGHT } from 'scripts/methods/constants'

export function ThemeSelector ({ settings, updateSettings }) {
  return <div className='row g-0 align-items-center mb-2'>
    <div className='col'>
      Кольорова тема
    </div>
    <div className='col-auto'>
      <Dropdown
        selected={settings.theme}
        items={ITEMS}
        onItemSelect={value => updateSettings('theme', value)}
      >
        <Select className='btn btn-outline-primary btn-sm'>{ ITEMS.find(({ value }) => value === settings.theme)?.label }</Select>
      </Dropdown>
    </div>
  </div>
}

const ITEMS = [
  { value: null, label: 'Як у системі' },
  { value: THEME_LIGHT, label: 'Світла' },
  { value: THEME_DARK, label: 'Темна' }
]