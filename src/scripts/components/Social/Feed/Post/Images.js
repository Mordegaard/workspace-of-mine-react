import React, { useEffect, useRef, useState } from 'react'

import styled, { css } from 'styled-components'

/**
 * @param {PostImage[]} images
 * @return {JSX.Element}
 * @constructor
 */
export function Images ({ images = [] }) {
  const [ index, setIndex ] = useState(0)

  const ref = useRef()

  useEffect(() => {
    ref.current.scrollLeft = index * ref.current.offsetWidth
  }, [ index ])

  return <div className='position-relative'>
    <Container
      ref={ref}
      className='d-flex'
      $image={images[index]}
    >
      {
        images.map((image, index) =>
          <a key={index} href={image.fullSizeUrl ?? image.url} target='_blank' rel='noreferrer'>
            <img src={image.url} alt='Post image' />
          </a>
        )
      }
    </Container>
    {
      index > 0 && <LeftButton className='flexed' onClick={() => setIndex(index - 1)}>
        <i className='bi bi-chevron-left fs-7 lh-0' />
      </LeftButton>
    }
    {
      index < images.length - 1 && <RightButton className='flexed' onClick={() => setIndex(index + 1)}>
        <i className='bi bi-chevron-right fs-7 lh-0' />
      </RightButton>
    }
  </div>
}

const Container = styled('div').attrs(({ $image }) => ({
  style: {
    aspectRatio: `${$image.width} / ${$image.height}`
  }
}))`
  position: relative;
  width: 100%;
  overflow: hidden;
  transition: aspect-ratio 0.35s ease;
  scroll-behavior: smooth;
  
  a {
    min-width: 100%;
  }
  
  img {
    width: 100%;
  }
`

const buttonStyles = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bs-pastel-gray-100);
  border: none;
  box-shadow: -1px 1px 16px -6px black;
  color: var(--bs-primary);
`

const LeftButton = styled('button')`
  ${buttonStyles};
  left: 8px;
`

const RightButton = styled('button')`
  ${buttonStyles};
  right: 8px;
`