import {Sponsor} from 'Event/SponsorPage'
import styled from 'styled-components'
import React from 'react'

type ImageProps = {
  sponsor: Sponsor
  isEditMode?: boolean
  className?: string
}

export default function Image(props: ImageProps) {
  const {sponsor} = props
  const src = sponsor.image?.url

  if (!sponsor.image && !props.isEditMode) {
    return null
  }

  return (
    <ImageBox className={props.className}>
      <ImageEl src={src} aria-label="sponsor image" />
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
  cursor: grab;
`
