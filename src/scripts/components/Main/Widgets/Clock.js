import React, { useEffect, useState } from 'react'

import { format } from 'date-fns'
import { uk } from 'date-fns/locale/uk'

import styled, { css } from 'styled-components'

import { FORMAT_HOUR, FORMAT_HOURLESS } from 'scripts/methods/constants'

export function Clock ({ widgetSettings }) {
  const [ date, setDate ] = useState(new Date)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date())
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  return <AbsoluteContainer
    $horizontal={widgetSettings.params.horizontal_position}
    $vertical={widgetSettings.params.vertical_position}
    $color={widgetSettings.params.color}
  >
    <HoursText>{ format(date, FORMAT_HOUR) }</HoursText>
    <DateText>{ format(date, `eeeeee | ${FORMAT_HOURLESS}`, { locale: uk }) }</DateText>
  </AbsoluteContainer>
}

const getHorizontalPosition = (position) => {
  switch (position) {
    case 'left':
      return css`
        left: 2%;
      `
    case 'center':
      return css`
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
      `
    case 'right':
      return css`
        right: 2%;
        text-align: right;
      `
  }
}

const getVerticalPosition = (position) => {
  switch (position) {
    case 'top':
      return css`
        top: 0;
      `
    case 'bottom':
      return css`
        bottom: 0;
      `
  }
}

const AbsoluteContainer = styled('div')`
  position: absolute;
  bottom: 0;
  padding: 48px;
  color: ${({ $color }) => $color};
    
  ${({ $horizontal }) => getHorizontalPosition($horizontal)};
  ${({ $vertical }) => getVerticalPosition($vertical)};
`

const HoursText = styled('h1')`
  font-size: 108px;
`

const DateText = styled('h2')`
  font-size: 48px;
`