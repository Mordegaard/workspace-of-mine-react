import React, { useEffect, useState } from 'react'

import { SocialController } from 'scripts/methods/social'
import { useCustomEvent } from 'scripts/methods/hooks'
import { Item } from 'scripts/components/TopBar/Settings/Social/List/Item'
import { insensitiveIncludes, mergeClasses } from 'scripts/methods/helpers'

export function List (props = {}) {
  const [ sources, setSources ] = useState([])
  const [ search, setSearch ] = useState('')

  const filteredSources = sources.filter(({ key, name, description }) =>
    !search
    || insensitiveIncludes(search, key)
    || insensitiveIncludes(search, name)
    || insensitiveIncludes(search, description)
  )

  const getSources = () => {
    SocialController.sources.get().then(sources => {
      setSources(sources.sort((a, b) => a.hidden - b.hidden))
    })
  }

  useCustomEvent('sources:updated', getSources)
  useEffect(getSources, [])

  return <div {...props}>
    <h6 className='fw-bold text-center'>Додані джерела</h6>
    <div className='my-2'>
      <input
        type='text'
        value={search}
        className='form-control'
        placeholder='Пошук'
        onChange={({ target }) => setSearch(target.value)}
      />
    </div>
    <div>
      {
        sources.map((source, index) =>
            <Item
            key={index}
            source={source}
            className={mergeClasses(!filteredSources.includes(source) && 'd-none')}
          />
        )
      }
      {
        filteredSources.length === 0 && <div className='fs-7 text-center mt-2 text-gray-300'>
          {
            sources.length === 0
              ? 'Ще не додано жодних джерел'
              : 'Нічого не знайдено'
          }
        </div>
      }
    </div>
  </div>
}