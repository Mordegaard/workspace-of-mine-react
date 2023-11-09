import React from 'react'

import { Input } from 'scripts/components/ui/Input'

export function UrlSelector ({ icon, onSelect }) {
  return <Input
    className='w-100'
    color='var(--bs-primary-darker)'
    value={icon.data}
    startIcon={<i className='bi bi-image' />}
    onChange={({ target }) => onSelect(target.value)}
  >
    Адреса зображення
  </Input>
}