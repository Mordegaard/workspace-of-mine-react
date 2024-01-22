import React, { useState, useEffect } from 'react'

import styled, { css } from 'styled-components'

import { mergeClasses } from 'scripts/methods/helpers'

export function Tabs ({ children, vertical = false, selectedTab = null, containerProps = {}, onSelect, ...props }) {
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

  return <TabsContainer $vertical={vertical} { ...containerProps }>
    <TabSelectorContainer $vertical={vertical} {...props}>
      {
        tabs.map((mapTab, index) =>
          <TabSelector
            key={index}
            className={mergeClasses(mapTab.className, mapTab.tabKey === tab && 'selected')}
            $vertical={vertical}
            onClick={() => setTab(mapTab.tabKey)}
          >
            { mapTab.title }
          </TabSelector>
        )
      }
    </TabSelectorContainer>
    <div>
      {
        tabElements.find(element => element.props.tabKey === tab)
      }
    </div>
  </TabsContainer>
}

// eslint-disable-next-line no-unused-vars
export function Tab ({ tabKey, children, title, ...props }) {
  return <div {...props}>{ children }</div>
}

const TabSelectorContainer = styled('div')`
  ${ ({ $vertical }) => $vertical
          ? css`
            flex-direction: column;
            text-align: start;
            margin-right: 12px;
          `
          : css`
            align-items: center;
            text-align: center;
            margin-bottom: 8px;
          `
  }
`

const TabsContainer = styled('div')`
  display: flex;
`

const TabSelector = styled('div')`
  flex: 1 0 0;
  border-radius: 8px;
  color: var(--bs-gray-600);
  cursor: pointer;

  ${ ({ $vertical }) => $vertical && css`
      padding: 4px 8px;
      font-weight: 600;
    `
  }
  
  &:hover {
    background: rgba(var(--bs-primary-rgb), 0.05);
    color: var(--bs-primary-darker);
  }

  &.selected {
    color: var(--bs-primary-darker);
    
    ${ ({ $vertical }) => $vertical
            ? css`
              background: rgba(var(--bs-primary-rgb), 0.25);
            `
            : css`
              border-bottom: 2px solid var(--bs-primary);
              padding-bottom: 1px;
            `
    }
  }
`
