import React, { useEffect, useRef, useState } from 'react'

import { SourcesSelector } from 'scripts/components/Social/SourcesSelector'
import { Feed } from 'scripts/components/Social/Feed'
import SocialController from 'scripts/methods/social'
import { useCustomEvent } from 'scripts/methods/hooks'

export function Social () {
  const [ sources, setSources ] = useState([])
  const [ selected, setSelected ] = useState(null)

  const ref = useRef()

  const getSources = () => {
    SocialController.sources.get().then(setSources)
  }

  useEffect(getSources, [])

  useCustomEvent('sources:updated', ({ detail: sources }) => {
    setSources(sources)

    if (!sources.find(({ key }) => key === selected)) {
      setSelected(null)
    }
  }, [])

  useEffect(() => {
    const boundingBox = ref.current.getBoundingClientRect()

    if (boundingBox.y < 0) {
      window.scrollTo({
        top: window.scrollY + boundingBox.y - 50,
        behavior: 'instant'
      })
    }
  }, [ selected ])

  return <div ref={ref} className='px-lg-4 mx-3 mx-md-5 row g-0'>
    <SourcesSelector sources={sources} selected={selected} onSelect={setSelected} />
    <Feed sources={sources} selected={selected} />
  </div>
}