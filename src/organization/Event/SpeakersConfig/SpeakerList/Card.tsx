import React from 'react'
import styled from 'styled-components'
import {Speaker as SpeakerData} from 'Event'

export const SPEAKER_PLACEHOLDER_IMG_URL = 'http://placehold.jp/200x200.png'

export default function Card(props: {
  speaker: SpeakerData
  onClick: () => void
}) {
  return (
    <Box onClick={props.onClick} aria-label="speaker">
      <ImageContainer>
        <Image image={props.speaker.image} alt={props.speaker.name} />
      </ImageContainer>
      <Body>
        <Name>{props.speaker.name}</Name>
        <div
          dangerouslySetInnerHTML={{
            __html: props.speaker.text,
          }}
        />
      </Body>
    </Box>
  )
}

function Image(props: {image: SpeakerData['image']; alt: string}) {
  if (!props.image) {
    // Placeholder
    return (
      <img
        src={SPEAKER_PLACEHOLDER_IMG_URL}
        alt={props.alt}
        aria-label="placeholder image"
      />
    )
  }

  return (
    <img src={props.image.url} alt={props.alt} aria-label="speaker image" />
  )
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`

const Body = styled.div`
  margin-left: ${(props) => props.theme.spacing[5]};
`

const Name = styled.p`
  text-transform: capitalize;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`

const ImageContainer = styled.div`
  width: 200px;

  img {
    width: 100%;
    max-height: 100%;
  }
`
