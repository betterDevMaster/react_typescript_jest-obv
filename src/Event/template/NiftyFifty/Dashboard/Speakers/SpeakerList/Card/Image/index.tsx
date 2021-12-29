import styled from 'styled-components'
import React from 'react'
import {Speaker} from 'Event/SpeakerPage'

export const SPEAKER_PLACEHOLDER = 'http://placehold.jp/300x300.png'

type ImageProps = {
  speaker: Speaker
  isEditMode?: boolean
  className?: string
}

export default function Image(props: ImageProps) {
  const {speaker} = props
  const alt = speaker.name

  if (!speaker.image) {
    // Placeholder
    return (
      <ImageBox className={props.className}>
        <img
          src={SPEAKER_PLACEHOLDER}
          alt={alt}
          aria-label="speaker placeholder image"
        />
      </ImageBox>
    )
  }

  return (
    <ImageBox className={props.className}>
      <img src={speaker.image.url} alt={alt} aria-label="speaker image" />
    </ImageBox>
  )
}

const ImageBox = styled.div`
  img {
    width: 100%;
    border-radius: 10px;
  }
`
