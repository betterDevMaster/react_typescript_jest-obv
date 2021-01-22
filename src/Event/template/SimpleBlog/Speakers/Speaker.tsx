import React from 'react'
import styled from 'styled-components'
import {Speaker as SpeakerData} from 'Event'
import {SPEAKER_PLACEHOLDER_IMG_URL} from 'organization/Event/SpeakersConfig/SpeakerList/Card'

export default function Speaker(props: {speaker: SpeakerData}) {
  return (
    <Box aria-label="speaker">
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
    return <img src={SPEAKER_PLACEHOLDER_IMG_URL} alt={props.alt} />
  }

  return <img src={props.image.url} alt={props.alt} />
}

const Box = styled.div`
  margin-left: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
