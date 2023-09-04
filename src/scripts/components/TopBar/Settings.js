import React, { useState } from 'react'

import styled from 'styled-components'

import { withTrigger } from 'scripts/methods/withComponent'
import { Modal } from 'scripts/components/ui/Modal'
import { Tabs, Tab } from 'scripts/components/ui/Tabs'
import { Social } from 'scripts/components/TopBar/Settings/Social'
import { General } from 'scripts/components/TopBar/Settings/General'

function SettingsBase ({ onClose }) {
  const [ tab, setTab ] = useState(TAB_GENERAL)

  const renderTitle = (label, icon) => {
    return <span>
      <i className={`bi bi-${icon} me-2`} />
      { label }
    </span>
  }

  return <Modal title='Налаштування' onClose={onClose}>
    <Tabs selectedTab={tab} onSelect={setTab} vertical>
      <StyledTab title={renderTitle('Загальні налаштування', 'sliders')} tabKey={TAB_GENERAL}>
        <General />
      </StyledTab>
      <StyledTab title={renderTitle('Соціальні функції', 'layout-three-columns')} tabKey={TAB_SOCIAL}>
        <Social />
      </StyledTab>
    </Tabs>
  </Modal>
}

export const Settings = withTrigger(SettingsBase)

const TAB_GENERAL = 'general'
const TAB_SOCIAL  = 'social'

const StyledTab = styled(Tab)`
  width: 650px;
`