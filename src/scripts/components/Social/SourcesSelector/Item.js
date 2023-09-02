import React from 'react'

import styled from 'styled-components'

import SocialSourcesController from 'scripts/methods/socialSources'
import { mergeClasses } from 'scripts/methods/helpers'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'

/**
 * @param {SocialSource} source
 * @return {JSX.Element}
 * @constructor
 */
export function Item ({ source }) {
  async function deleteSource (e) {
    e.stopPropagation()
    await SocialSourcesController.remove(source.key)
  }

  return <Container>
    <div className='row gx-2 align-items-center'>
      <div className={mergeClasses('col-auto text-pastel-gray-500', source.hidden && 'opacity-50')}>
        <SocialIcon type={source.type} />
      </div>
      <div className='col'>{ source.key }</div>
      <div className='col-auto'>
        <button className='icon-button fs-7' onClick={deleteSource}>
          <i className='bi bi-x' />
        </button>
      </div>
    </div>
  </Container>
}

const Container = styled('div')`
  background: var(--bs-pastel-gray-100);
  padding: 4px 8px;
  border-radius: 666px;
  margin: 0 6px;
  box-shadow: -1px 1px 18px -10px black;
  cursor: pointer;
`