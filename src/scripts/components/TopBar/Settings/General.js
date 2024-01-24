import React from 'react'

import { SocialLayout } from 'scripts/components/TopBar/Settings/General/SocialLayout'
import { AccentColor } from 'scripts/components/TopBar/Settings/General/AccentColor'

export function General ({ settings, updateSettings }) {
  return <div>
    <AccentColor settings={settings} updateSettings={updateSettings} />
    <SocialLayout settings={settings} updateSettings={updateSettings} />
  </div>
}