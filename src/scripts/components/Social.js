import React, { useEffect, useState } from 'react'

import { SourcesSelector } from 'scripts/components/Social/SourcesSelector'
import { Feed } from 'scripts/components/Social/Feed'
import SocialController from 'scripts/methods/social'
import { useCustomEvent } from 'scripts/methods/hooks'

export function Social () {
  const [ sources, setSources ] = useState([])
  const [ selected, setSelected ] = useState(null)

  const getSources = () => {
    SocialController.sources.get().then(setSources)
  }

  useCustomEvent('sources:updated', getSources)
  useEffect(getSources, [])

  return <div className='px-3 mx-5'>
    <SourcesSelector sources={sources} selected={selected} onSelect={setSelected} />
    <Feed sources={sources} selected={selected} />
  </div>
}