import React from 'react'
import { Dropdown, Select } from 'scripts/components/ui/Dropdown'

export function HiddenSourcesLayout ({ settings, updateSettings }) {
  return <div className='row g-0 mb-2'>
    <div className='col'>
      Відобаражати приховані джерела як
    </div>
    <div className='col-auto'>
      <Dropdown
        selected={settings.layout.dropdown_hidden_sources}
        items={ITEMS}
        onItemSelect={value => updateSettings('layout.dropdown_hidden_sources', value)}
      >
        <Select className='btn btn-outline-primary btn-sm'>{ ITEMS.find(({ value }) => value ===settings.layout.dropdown_hidden_sources)?.label }</Select>
      </Dropdown>
    </div>
  </div>
}

const ITEMS = [
  { value: false, label: 'Список' },
  { value: true, label: 'Випадаючий список' }
]