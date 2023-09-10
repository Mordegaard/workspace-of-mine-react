import React, { useState } from 'react'

import styled from 'styled-components'

import { withTrigger } from 'scripts/methods/withComponent'
import { Modal } from 'scripts/components/ui/Modal'
import { Tabs, Tab } from 'scripts/components/ui/Tabs'
import { General } from 'scripts/components/TopBar/Settings/General'
import { Wallpaper } from 'scripts/components/TopBar/Settings/Wallpaper'
import { Social } from 'scripts/components/TopBar/Settings/Social'
import { Memory } from 'scripts/components/TopBar/Settings/Memory'

function SettingsBase ({ onClose }) {
  const [ tab, setTab ] = useState(TAB_GENERAL)

  const renderTitle = (label, icon) => {
    return <span>
      <i className={`bi bi-${icon} me-2`} />
      { label }
    </span>
  }

  return <StyledModal title='Налаштування' onClose={onClose}>
    <Tabs selectedTab={tab} onSelect={setTab} vertical>
      <StyledTab title={renderTitle('Загальні налаштування', 'sliders')} tabKey={TAB_GENERAL}>
        <General />
      </StyledTab>
      <StyledTab title={renderTitle('Шпалери', 'image')} tabKey={TAB_WALLPAPER}>
        <Wallpaper />
      </StyledTab>
      <StyledTab title={renderTitle('Соціальні функції', 'layout-three-columns')} tabKey={TAB_SOCIAL}>
        <Social />
      </StyledTab>
      <StyledTab title={renderTitle('Пам\'ять та дані', 'database-down')} tabKey={TAB_MEMORY}>
        <Memory />
      </StyledTab>
    </Tabs>
  </StyledModal>
}

export const Settings = withTrigger(SettingsBase)

const TAB_GENERAL   = 'general'
const TAB_WALLPAPER = 'wallpaper'
const TAB_SOCIAL    = 'social'
const TAB_MEMORY    = 'memory'

const StyledModal = styled(Modal)`
  height: 80vh;
`

const StyledTab = styled(Tab)`
  width: 650px;
`