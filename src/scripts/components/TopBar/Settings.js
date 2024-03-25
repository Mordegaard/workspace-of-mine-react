import React, { useState } from 'react'

import styled from 'styled-components'

import SettingsManager from 'scripts/methods/settings'
import { withTrigger } from 'scripts/methods/factories'
import { Modal } from 'scripts/components/ui/Modal'
import { Tabs, Tab } from 'scripts/components/ui/Tabs'
import { General } from 'scripts/components/TopBar/Settings/General'
import { Wallpaper } from 'scripts/components/TopBar/Settings/Wallpaper'
import { Social } from 'scripts/components/TopBar/Settings/Social'
import { Memory } from 'scripts/components/TopBar/Settings/Memory'

function SettingsBase ({ onClose }) {
  const [ tab, setTab ] = useState(TAB_GENERAL)
  const [ settings, setSettings ] = useState(SettingsManager.get())

  const updateSettings = async (key, value) => {
    SettingsManager.set(key, value)
    setSettings({ ...settings, [key]: value })
  }

  const renderTab = (tab, label, icon) => {
    return <StyledTab
      title={
        <span>
          <i className={`bi bi-${icon} me-2`} />
          { label }
        </span>
      }
      className='px-2'
      tabKey={tab}
    >
      {
        React.createElement(TABS_MAPPING[tab], { settings, updateSettings })
      }
    </StyledTab>
  }

  return <Modal scrollable={false} title='Налаштування' onClose={onClose}>
    <Tabs
      vertical
      containerProps={{ className: 'h-100' }}
      selectedTab={tab}
      onSelect={setTab}
    >
      { renderTab(TAB_GENERAL, 'Загальні налаштування', 'sliders') }
      { renderTab(TAB_WALLPAPER, 'Шпалери', 'image') }
      { renderTab(TAB_SOCIAL, 'Соціальні функції', 'layout-three-columns') }
      { renderTab(TAB_MEMORY, 'Пам\'ять та дані', 'database-down') }
    </Tabs>
  </Modal>
}

export const Settings = withTrigger(SettingsBase)

const TAB_GENERAL   = 'general'
const TAB_WALLPAPER = 'wallpaper'
const TAB_SOCIAL    = 'social'
const TAB_MEMORY    = 'memory'

const TABS_MAPPING = {
  [TAB_GENERAL]: General,
  [TAB_WALLPAPER]: Wallpaper,
  [TAB_SOCIAL]: Social,
  [TAB_MEMORY]: Memory
}

const StyledTab = styled(Tab)`
  width: 650px;
  height: 500px;
  max-width: 50vw;
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
`