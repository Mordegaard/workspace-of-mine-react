import React from 'react'

import styled from 'styled-components'

export function Switch ({ checked, readOnly, onChange, ...props }) {
  if (checked ==  null) checked = Boolean(checked)

  return <SwitchContainer { ...props }>
    <input type="checkbox" onChange={onChange} checked={checked} readOnly={readOnly} />
    <div />
  </SwitchContainer>
}

const SwitchContainer = styled('label')`
  position: relative;

  div {
    position: relative;
    width: 24px;
    height: 16px;
    border-radius: 666px;
    background: #a2a2a2;
    transition: background 0.2s ease;

    &:after {
      content: "";
      position: absolute;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: white;
      box-shadow: 1px 1px 8px -4px #00000080;
      top: -3px;
      left: -10px;
      transition: transform 0.2s ease;
    }
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
        transform: translateX(24px);
      }
    }

    &:disabled + div {
      background: #aaa;

      &:after {
        background: #ddd;
      }
    }
  }
`
