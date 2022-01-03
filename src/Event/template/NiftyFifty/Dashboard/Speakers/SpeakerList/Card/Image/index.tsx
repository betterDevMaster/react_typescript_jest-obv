import React from 'react'
import styled from 'styled-components'
import {Speaker} from 'Event/SpeakerPage'

type ImageProps = {
  speaker: Speaker
  isEditMode?: boolean
  className?: string
}

export default function Image(props: ImageProps) {
  const {speaker} = props
  const src = speaker.image?.url

  if (!speaker.image && !props.isEditMode) {
    return null
  }

  return (
    <ImageBox className={props.className}>
      <ImageEl src={src} aria-label="speaker image" />
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
