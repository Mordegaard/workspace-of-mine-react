import React, { useEffect, useState } from 'react'

import { SocialController } from 'scripts/methods/social'
import { useCustomEvent } from 'scripts/methods/hooks'
import { Item } from 'scripts/components/TopBar/Settings/Social/List/Item'

export function List () {
  const [ sources, setSources ] = useState([])

  const getSources = () => {
    SocialController.sources.get().then(setSources)
  }

  useCustomEvent('sources:updated', getSources)
  useEffect(getSources, [])

  return <div className='mt-4'>
    <div className='text-center'>
      <span className='h6 fw-bold'>Додані джерела</span>
    </div>
    <div>
      {
        sources.map((source, index) => <Item key={index} source={source} />)
      }
      {
        sources.length === 0 && <div className='fs-7 text-center mt-2 text-gray-300'>
          Ще не додано жодних джерел
        </div>
      }
    </div>
  </div>
}