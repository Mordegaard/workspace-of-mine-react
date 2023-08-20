import React, { useRef, useState } from 'react'

import styled from 'styled-components'

/**
 * @param {JSX.Element} children
 * @param {string} className
 * @param {string} error
 * @param {JSX.Element} startIcon
 * @param {JSX.Element} endIcon
 * @param {string} placeholder
 * @param {string} color
 * @param {string} value
 * @param {callback} onChange
 * @type {React.ForwardRefExoticComponent}
 */
export const Input = React.forwardRef(({ children, className, error, startIcon, endIcon, placeholder, color, ...props }, ref) => {
  return <Container
    className={className}
    color={color}
    hasStart={!!startIcon}
    hasEnd={!!endIcon}
  >
    <StyledInput
      { ...props }
      ref={ref}
      hasStart={!!startIcon}
      hasEnd={!!endIcon}
      className={!children ? 'show-placeholder' : ''}
      placeholder={placeholder ?? (children && String(children))}
    />
    {
      children && <span className='input-placeholder'>{ children }</span>
    }
    {
      startIcon && <div className="input-icon start">{ startIcon }</div>
    }
    {
      endIcon && <div className="input-icon end">{ endIcon }</div>
    }
    {
      error && <span className="error-message">
        <i className="bi bi-info-circle me-2" />
        { error }
      </span>
    }
  </Container>
})

export function PasswordInput ({ children, ...rest }) {
  const [ showPassword, setShowPassword ] = useState(false)

  const passwordInputRef = useRef()

  function updateShowPassword () {
    passwordInputRef.current?.focus()
    setShowPassword(!showPassword)
  }

  return <Input
    { ...rest }
    ref={passwordInputRef}
    type={showPassword ? 'text' : 'password'}
    autoComplete='current-password'
    endIcon={<i className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`} onClick={updateShowPassword} />}
  >
    { children }
  </Input>
}

Input.displayName = 'Input'

const Container = styled('label')`
  position: relative;
  white-space: nowrap;
  ${({ color }) => `color: ${color || 'black'}`};
  border-bottom: 2px solid currentColor;

  ${({ hasStart, hasEnd }) => `padding: 6px ${hasEnd ? 30 : 4}px 2px ${hasStart ? 30 : 4}px`};

  &:focus-within {
    border-color: var(--bs-primary);

    .input-icon {
      color: var(--bs-primary);
    }
  }

  .input-placeholder {
    position: absolute;
    bottom: 2px;
    left: ${({ hasStart }) => hasStart ? 30 : 4}px;
    color: inherit;
    opacity: 0.667;
    pointer-events: none;
    transition: transform 0.2s, opacity 0.2s;
  }

  .input-icon {
    position: absolute;
    bottom: 0;
    font-size: 20px;
    color: inherit;

    &.start {
      left: 0;
    }

    &.end {
      right: 0;
    }
  }
`

const StyledInput = styled('input')`
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  color: inherit;

  ${({ font }) => font && `font: ${font};`}

  &::placeholder {
    color: inherit;
    opacity: 0;
  }

  &.show-placeholder::placeholder {
    opacity: 0.3334;
  }

  &:focus + span, &:not(:placeholder-shown) + span {
    transform: translate(-${({ hasStart }) => hasStart ? 34 : 10}px, -26px) scale(0.8);
    opacity: 1;
    color: var(--bs-primary);
  }

  &:-webkit-autofill,
  &:-webkit-autofill:focus {
    transition: background-color 600000s 0s, color 600000s 0s;
  }
`
