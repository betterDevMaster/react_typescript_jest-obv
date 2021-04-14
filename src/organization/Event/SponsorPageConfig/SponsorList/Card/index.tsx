import React from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import {useEvent} from 'Event/EventProvider'
import {Sponsor} from 'Event'
import NavButton from 'Event/Dashboard/components/NavButton'

export const SPONSOR_QUESTION_ICON_PLACEHOLDER = 'http://placehold.jp/50x50.png'
export const SPONSOR_PLACEHOLDER = 'http://placehold.jp/200x200.png'

export default function Card(props: {
  sponsor: Sponsor
  onClickField: () => void
  onClickImage: () => void
}) {
  const {sponsor} = props

  return (
    <Box aria-label="sponsor">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2}>
          <Editable>
            <ImageContainer onClick={props.onClickImage}>
              <Image image={props.sponsor.image} alt={props.sponsor.name} />
            </ImageContainer>
          </Editable>
          <Buttons sponsor={props.sponsor} onClick={props.onClickField} />
        </Grid>
        <Grid item xs={10} sm={9} aria-label="sponsor">
          <Editable onClick={props.onClickField}>
            <Body>
              <Name>{props.sponsor.name}</Name>
              <div
                dangerouslySetInnerHTML={{
                  __html: props.sponsor.description,
                }}
              />
            </Body>
          </Editable>
        </Grid>
        <Grid item xs={12} sm={1}>
          <ImageContainer>
            <QuestionIcon sponsor={sponsor} />
          </ImageContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

function Image(props: {image: Sponsor['image']; alt: string}) {
  if (!props.image) {
    // Placeholder
    return (
      <img
        src={SPONSOR_PLACEHOLDER}
        alt={props.alt}
        aria-label="sponsor placeholder image"
      />
    )
  }

  return (
    <img src={props.image.url} alt={props.alt} aria-label="sponsor image" />
  )
}

function Buttons(props: {sponsor: Sponsor; onClick: () => void}) {
  const {
    sponsor: {buttons},
  } = props

  if (!buttons) {
    return null
  }

  return (
    <Editable>
      <EditOverlay onClick={props.onClick} />
      {buttons.ids.map((id) => (
        <ButtonBox key={id}>
          <NavButton {...buttons.entities[id]} aria-label="sponsor button" />
        </ButtonBox>
      ))}
    </Editable>
  )
}

function QuestionIcon(props: {sponsor: Sponsor}) {
  const {event} = useEvent()
  const {sponsor_question_icon} = event

  const src = sponsor_question_icon
    ? sponsor_question_icon.url
    : SPONSOR_QUESTION_ICON_PLACEHOLDER

  return <img src={src} alt={props.sponsor.name} />
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
`

const Editable = styled.div`
  cursor: pointer;
  position: relative;

  &:hover {
    opacity: 0.6;
  }
`

const EditOverlay = styled.div`
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`

const Body = styled.div`
  margin-left: ${(props) => props.theme.spacing[5]};
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`

const Name = styled.p`
  text-transform: capitalize;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`

const ImageContainer = styled.div`
  img {
    width: 100%;
    max-height: 100%;
  }
`

const ButtonBox = styled.div`
  &:not(:last-child) {
    margin-bottom: ${(props) => props.theme.spacing[1]};
  }
`
