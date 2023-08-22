import React, { useRef, useState } from 'react'

import styled, { css, keyframes } from 'styled-components'

import SocialSourcesController, { SOURCE_REDDIT, SOURCE_TELEGRAM, sourceDescriptions } from 'scripts/methods/socialSources'
import { useBlurHook } from 'scripts/methods/hooks'
import { handleInputEnterPress, handleInputValue } from 'scripts/methods/handlers'
import { mergeClasses } from 'scripts/methods/helpers'

export function AddSource ({ active = false, onActiveChange }) {
  const [ key, setKey ] = useState('')
  const [ type, setType ] = useState(SOURCE_REDDIT)
  const [ error, setError ] = useState(false)

  const ref = useRef()

  function close () {
    setKey('')
    setError(false)
    onActiveChange(false)
  }

  async function handleSubmit () {
    if (!active) {
      onActiveChange(true)
    } else {
      const success = Boolean(await SocialSourcesController.put(key, type))
      success ? close() : setError(true)
    }
  }

  useBlurHook(ref, close)

  return <div ref={ref} className='position-relative'>
    <StyledInput
      $active={active}
      className={mergeClasses('form-control', error && 'is-invalid')}
      placeholder={sourceDescriptions[type].placeholder}
      value={key}
      onChange={handleInputValue(setKey)}
      onKeyUp={handleInputEnterPress(handleSubmit)}
    />
    <div className='position-relative'>
      {
        active && <>
          <Outline $color={sourceDescriptions[type].color} />
          <Outline $color={sourceDescriptions[type].color} $delay={750} />
        </>
      }
      <RoundButton
        className='btn btn-round btn-pastel-gray-100 flexed'
        onClick={handleSubmit}
      >
        <i className='bi bi-plus-lg' />
      </RoundButton>
    </div>
  </div>
}

const SIZE = 36
const INPUT_WIDTH = 300

const expanding = keyframes`
  0%   { transform: none; opacity: 0.33; }
  100% { transform: scale(2); opacity: 0; }
`

const Outline = styled('div')`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  animation: ${expanding} 1.5s linear infinite;
  
  ${({ $delay }) => $delay && css`
    animation-delay: ${$delay}ms
  `}
`

const RoundButton = styled('button')`
  position: relative;
  width: ${SIZE}px;
  height: ${SIZE}px;
  box-shadow: -1px 1px 18px -8px black;
`

const StyledInput = styled('input')`
  position: absolute;
  top: 0;
  right: 1px;
  max-width: ${SIZE}px;
  width: ${INPUT_WIDTH}px;
  height: ${SIZE}px;
  background: white;
  border-radius: 666px;
  opacity: 0;
  padding: 4px 0;
  border: none;
  transition: max-width 0.25s ease, padding 0.25s ease, opacity 0.25s 0.12s ease;
  will-change: max-width, padding, opacity;
  
  &.is-invalid {
    color: var(--bs-danger);
    border: 2px solid var(--bs-danger);
  }
  
  ${({ $active }) => $active && css`
    max-width: ${INPUT_WIDTH}px;
    padding: 4px ${SIZE + 16}px 4px 16px;
    opacity: 1;
    transition: max-width 0.25s ease, padding 0.25s ease;
  `}
`