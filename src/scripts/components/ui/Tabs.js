import React, { useState, useEffect } from 'react'

import styled from 'styled-components'

import { mergeClasses } from 'scripts/methods/helpers'

export function Tabs ({ children, className, selectedTab = null, onSelect }) {
  if (!Array.isArray(children)) {
    children = [children]
  }

  const tabElements = children.filter(({ type }) => type === Tab || type?.target === Tab)

  const [ tabs ] = useState(tabElements.map(({ props }) => props))
  const [ tab, setTab ] = useState(selectedTab ?? tabs[0]?.tabKey)

  useEffect(() => {
    if (selectedTab) setTab(selectedTab)
  }, [ selectedTab ])

  useEffect(() => {
    typeof onSelect === 'function' && onSelect(tab)
  }, [ tab ])

  return <div>
    <div className={mergeClasses(className, 'row', 'g-0')}>
      {
        tabs.map((mapTab, index) =>
          <TabSelector
            key={index}
            className={mergeClasses(mapTab.className, mapTab.tabKey === tab && 'selected')}
            onClick={() => setTab(mapTab.tabKey)}
          >
            { mapTab.title }
          </TabSelector>
        )
      }
    </div>
    <div>
      {
        tabElements.map((child, index) =>
          React.cloneElement(child, {
            key: index,
            selectedTab: tab,
          })
        )
      }
    </div>
  </div>
}

export function Tab ({ tabKey, selectedTab, children }) {
  if (tabKey !== selectedTab) return null

  return children
}

const TabSelector = styled('div')`
  flex: 1 0 0;
  cursor: pointer;
  text-align: center;

  &.selected {
    border-bottom: 2px solid var(--bs-primary);
    padding-bottom: 1px;
    font-weight: 700;
  }
`
