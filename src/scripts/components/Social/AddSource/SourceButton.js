import React, { useEffect, useRef, useState } from 'react'

import styled, { css } from 'styled-components'

import { mergeClasses } from 'scripts/methods/helpers'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'
import { handleInputValue } from 'scripts/methods/handlers'
import { SocialController } from 'scripts/methods/social'
import { useContextLoader } from 'scripts/methods/hooks'
import { Item } from 'scripts/components/TopBar/Settings/Social/List/Item'
import { Loader } from 'scripts/components/ui/Loader'

const getElementHeight = element => (element.scrollHeight) + 'px'

export function SourceButton ({ data, selected, texts, onSelectedChange, onClose }) {
  const { throughLoading, isLoading } = useContextLoader()

  const [ search, setSearch ] = useState('')
  const [ source, setSource ] = useState(null)

  const isSelected = selected === data.key

  const headerRef = useRef()
  const contentRef = useRef()

  function find () {
    return throughLoading(async () => {
      const source = await SocialController.sources[data.key].find(search)

      if (source) {
        setSource(SocialController.sources[data.key].parse(source))
      }
    })
  }

  function put () {
    return throughLoading(async () => {
      const success = await SocialController.sources.put(source.key, data.key)

      if (success) {
        onClose()
      }
    }, 'put')
  }

  useEffect(() => {
    headerRef.current.style.maxHeight = !isSelected ? getElementHeight(headerRef.current) : 0
    contentRef.current.style.maxHeight = isSelected ? getElementHeight(contentRef.current) : 0
  }, [ isSelected, source ])

  return <Button
    $data={data}
    $isSelected={isSelected}
    onClick={onSelectedChange.bind(null, data.key)}
  >
    <MaskedBackground $data={data} />
    <BigIcon className={mergeClasses('flexed', `bg-${data.key}`)} $isSelected={isSelected}>
      <StyledSourceIcon type={data.key} />
    </BigIcon>
    <ShrinkableContainer ref={headerRef} $visible={!isSelected}>
      <div className='d-flex align-items-center px-4 py-3'>
        <StyledSourceIcon type={data.key} className='me-3' />
        <span className='fs-5'>{ data.name }</span>
      </div>
    </ShrinkableContainer>
    <ShrinkableContainer ref={contentRef} $visible={isSelected}>
      <div className='mt-4 px-4 py-3'>
        <label className='form-label'>{ texts.label }</label>
        <div className='input-group rounded-2 shadow'>
          <StyledInput
            type='text'
            placeholder={data.placeholder}
            value={search}
            onChange={handleInputValue(setSearch)}
          />
          <button
            className='btn btn-white'
            disabled={!search.trim() || isLoading()}
            onClick={find}
          >
            {
              isLoading()
                ? <Loader size={24} color={data.color} />
                : <><i className='bi bi-search me-2' />Знайти</>
            }
          </button>
        </div>
        {
          source != null && <div className='mt-2'>
            <Item
              source={source}
              interactive={false}
              className='text-start bg-white shadow'
            />
          <button
            className={mergeClasses('btn', `btn-${data.key}`, 'mt-2')}
            disabled={isLoading('put')}
            onClick={put}
          >
            {
              isLoading('put')
                ? <Loader size={24} color={data.color} />
                : 'Додати'
            }
          </button>
          </div>
        }
      </div>
    </ShrinkableContainer>
  </Button>
}

const ANIMATION_DURATION = 400

const ShrinkableContainer = styled('div')`
  position: relative;
  overflow: hidden;
  transition: max-height ${ANIMATION_DURATION}ms ease, opacity ${ANIMATION_DURATION * 0.5}ms ease;
  z-index: 1;
  
  ${({ $visible }) => !$visible && css`opacity: 0`}
`

const MaskedBackground = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  border-radius: var(--bs-btn-border-radius);
  mask-image: linear-gradient(-90deg, black, transparent);
  pointer-events: none;
  z-index: 0;
  
  ${({ $data }) => css`
    background-image: url("assets/images/backgrounds/${$data.key}.svg");
  `}
`

const Button = styled('button').attrs(({ $isSelected, $data }) => ({
  className: mergeClasses('btn', $isSelected ? `btn-white` : `btn-${$data.key} text-white`),
}))`
  position: relative;
  width: 100%;
  margin: 12px 0;
  padding: 0;
  border: none;
  
  ${({ $isSelected }) => $isSelected && css`cursor: inherit !important;`}
`

const StyledSourceIcon = styled(SocialIcon)`
  width: 32px;
  height: 32px;
`

const StyledInput = styled('input').attrs({ className: 'form-control' })`
  background-color: white;
  border: none;
`

const BigIcon = styled('div')`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 72px;
  height: 72px;
  border-radius: 50%;
  line-height: 0;
  color: white;
  pointer-events: none;
  transition: opacity ${ANIMATION_DURATION}ms ease;
  
  ${({ $isSelected }) => !$isSelected && css`opacity: 0;`}
`