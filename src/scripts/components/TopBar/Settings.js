import React, { useState } from 'react'

import styled from 'styled-components'

import { withTrigger } from 'scripts/methods/withComponent'
import { Modal } from 'scripts/components/ui/Modal'
import { Tabs, Tab } from 'scripts/components/ui/Tabs'
import { Social } from 'scripts/components/TopBar/Settings/Social'

function SettingsBase ({ onClose }) {
  const [ tab, setTab ] = useState(TAB_GENERAL)

  return <Modal title='Налаштування' onClose={onClose}>
    <Tabs selectedTab={tab} onSelect={setTab} vertical>
      <StyledTab title='Загальні налаштування' tabKey={TAB_GENERAL}>
        GENERAL
      </StyledTab>
      <StyledTab title='Соціальні функції' tabKey={TAB_SOCIAL}>
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