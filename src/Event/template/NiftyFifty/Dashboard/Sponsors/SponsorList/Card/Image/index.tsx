import {Sponsor} from 'Event/SponsorPage'
import styled from 'styled-components'
import React from 'react'

const SPONSOR_PLACEHOLDER = 'http://placehold.jp/300x100.png'

type ImageProps = {
  sponsor: Sponsor
  isEditMode?: boolean
  className?: string
}

export default function Image(props: ImageProps) {
  const {sponsor} = props
  const alt = sponsor.name

  if (!sponsor.image && !props.isEditMode) {
    return null
  }

  const src = sponsor.image?.url || SPONSOR_PLACEHOLDER

  return (
    <ImageBox className={props.className}>
      <ImageEl src={src} alt={alt} aria-label="sponsor image" />
    </ImageBox>
  )
}

const ImageBox = styled.div`
  img {
    width: 100%;
    border-radius: 10px;
  }
`

const ImageEl = styled.img`
  cursor: 'grab';
`
