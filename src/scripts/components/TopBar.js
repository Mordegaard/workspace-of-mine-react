import React from 'react'

import { WallpaperDescription } from 'scripts/components/TopBar/WallpaperDescription'
import { Settings } from 'scripts/components/TopBar/Settings'
import { SettingsButton } from 'scripts/components/TopBar/Settings/SettingsButton'
import { Tooltip } from 'scripts/components/ui/Tooltip'

export function TopBar () {
  return <div className='row g-0 w-100 p-2'>
    <div className='col'>
      <WallpaperDescription />
    </div>
    <div className='col-auto'>
      <Settings
        trigger={
          <div>
            <Tooltip content='Відкрити налаштування' placement='left'>
              <SettingsButton className='icon-button text-white'>
                <i className="bi bi-gear p-1" />
              </SettingsButton>
            </Tooltip>
          </div>
        }
      />
    </div>
  </div>
}