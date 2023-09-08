import React, { useState } from 'react'

import { SourcesSelector } from 'scripts/components/Social/SourcesSelector'
import { Feed } from 'scripts/components/Social/Feed'

export function Social () {
  const [ selected, setSelected ] = useState(null)

  return <div className='px-3 mx-5'>
    <SourcesSelector selected={selected} onSelect={setSelected} />
    <Feed selected={selected} />
  </div>
}