import React from 'react'

import styled from 'styled-components'

export function Checkbox ({ label, className, checked, error, onChange, ...props }) {
  if (checked ==  null) checked = Boolean(checked)

  return <CheckboxContainer { ...props }>
    <input type="checkbox" onChange={onChange} checked={checked} />
    <div className={className} />
    <span>{ label }</span>
    {
      error && <span className="error-message">
        <i className="bi bi-info-circle me-2" />
        { error }
      </span>
    }
  </CheckboxContainer>
}

const CheckboxContainer = styled('label')`
  position: relative;
  display: flex;
  align-items: center;
  
  div {
    position: relative;
    width: 16px;
    min-width: 16px;
    height: 16px;
    border-radius: 2px;
    background: #808080;
  }

  input[type="checkbox"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    opacity: 0;

    &:checked + div {
      background: var(--bs-primary);

      &:after {
        content: "";
        position: absolute;
        width: 10px;
        height: 5px;
        border-left: 2px solid white;
        border-bottom: 2px solid white;
        transform: rotate(-45deg);
        top: 4px;
        left: 3px;
      }
    }
  }
`
