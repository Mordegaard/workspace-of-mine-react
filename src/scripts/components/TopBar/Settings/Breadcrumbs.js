import React, { useEffect, useMemo, useRef } from 'react'

import styled, { css } from 'styled-components'

import { Tabs, Tab } from 'scripts/components/ui/Tabs'

/**
 * @typedef {object} RouteItem
 * @property {React.Component} component
 * @property {string} [icon]
 * @property {Object<string, RouteItem>} [children]
 */

/**
 * @param {Object<string, RouteItem>} map
 * @param {string} route
 * @param {function} onRouteUpdate
 * @param {object} props
 * @return {React.JSX.Element}
 * @constructor
 */
export function Breadcrumbs ({ map, route = '/', onRouteUpdate, ...props }) {
  const path = useMemo(getPath, [ route ])

  const ref = useRef()

  const router = {
    to: routerTo,
    back: routerBack,
    push: routerPush
  }

  function getPath () {
    const parts = route.split('/').filter(Boolean)

    let path = []
    let result = { children: map }

    for (const part of parts) {
      result = result.children?.[part]

      if (result == null) {
        throw new Error('Cannot find component for the given path')
      } else {
        path.push({ ...result, key: part })
      }
    }

    return path
  }

  function routerBack () {
    const newRoute = path.map(({ key }) => key).slice(0, -1)
    onRouteUpdate(newRoute.join('/'))
  }

  function routerPush (pathKey) {
    const newRoute = [ ...path.map(({ key }) => key), pathKey ]
    onRouteUpdate(newRoute.join('/'))
  }

  function routerTo (pathKey) {
    const keys = path.map(({ key }) => key)

    const index = keys.indexOf(pathKey)
    let newRoute

    if (index === -1) {
      newRoute = [ ...keys, pathKey ]
    } else {
      newRoute = keys.slice(0, index + 1)
    }

    onRouteUpdate(newRoute.join('/'))
  }

  function calculateShift () {
    let shift = 0

    const child = ref.current.children[0]

    if (path.length < 2) {
      shift = -16
      ref.current.classList.remove('overflow')
    } else {
      setTimeout(() => ref.current.classList.add('overflow'), ANIMATION_SPEED)

      if (child.offsetWidth < child.scrollWidth) {
        shift = child.offsetWidth - child.scrollWidth
      }
    }

    child.style.transform = `translateX(${shift}px)`
  }

  useEffect(() => {
    window.requestAnimationFrame(calculateShift)
  }, [ path ])

  return <div>
    <BreadcrumbsContainer>
      <StyledIconButton visible={path.length > 1} onClick={routerBack}>
        <i className='bi bi-chevron-left'/>
      </StyledIconButton>
      <OverflowContainer ref={ref}>
        <ShiftableContainer className='d-flex align-items-center'>
          {
            path
              .map(({ key, component }, index) => [
                <StyledLinkButton key={index * 2} onClick={() => routerTo(key)}>
                  { component.ROUTE_NAME ?? key.replaceAll('_', ' ') }
                </StyledLinkButton>,
                <i key={index * 2 + 1} className='bi bi-chevron-double-right lh-0 fs-7 mx-2'/>
              ])
              .flat()
              .slice(0, -1)
          }
        </ShiftableContainer>
      </OverflowContainer>
    </BreadcrumbsContainer>
    <div className='mt-5'>
      <Tabs
        vertical
        containerProps={{ className: 'h-100' }}
        selectedTab={path[0].key}
        onSelect={onRouteUpdate}
      >
        {
          Object.entries(map).map(([ key, routeItem ]) =>
            <StyledTab
              key={key}
              title={
                <span>
                { routeItem.icon && <i className={ `bi bi-${routeItem.icon} me-2` }/> }
                  { routeItem.component.ROUTE_NAME ?? key.replaceAll('_', ' ') }
                </span>
              }
              className='px-2'
              tabKey={key}
            >
              {
                React.createElement(path.at(-1).component, { ...props, router })
              }
            </StyledTab>
          )
        }
      </Tabs>
    </div>
  </div>
}

const ANIMATION_SPEED = 250

const StyledIconButton = styled('button').attrs({ className: 'icon-button' })`
  transition: opacity ${ANIMATION_SPEED}ms ease;
    
  ${({ visible }) => !visible && css`
    opacity: 0;
    pointer-events: none;
  `}
`

const StyledLinkButton = styled('button').attrs({ className: 'link-button h5' })`
  color: var(--bs-body-color);
  white-space: nowrap;
`

const StyledTab = styled(Tab)`
  width: 650px;
  height: 500px;
  max-width: 50vw;
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
`

const BreadcrumbsContainer = styled('div')`
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.8rem 0.75rem 0.5rem;
  border-bottom: 1px solid var(--bs-gray-200);
`

const OverflowContainer = styled('div')`
  margin-left: 0.5rem;
  margin-right: 40px;
    
  &.overflow {
    overflow: hidden;
  }
`

const ShiftableContainer = styled('div')`
  transition: transform ${ANIMATION_SPEED}ms ease;
`