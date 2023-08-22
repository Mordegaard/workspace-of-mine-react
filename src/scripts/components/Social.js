import React from 'react'

import { SourcesSelector } from 'scripts/components/Social/SourcesSelector'
import { Feed } from 'scripts/components/Social/Feed'

export function Social () {
  return <div>
    <SourcesSelector />
    <Feed />
  </div>
}