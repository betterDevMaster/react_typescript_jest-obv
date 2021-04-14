import React from 'react'
import styled from 'styled-components'
import {Sponsor as SponsorData} from 'Event'
import Grid from '@material-ui/core/Grid'
import {useEvent} from 'Event/EventProvider'
import NavButton from 'Event/Dashboard/components/NavButton'
import {
  SPONSOR_PLACEHOLDER,
  SPONSOR_QUESTION_ICON_PLACEHOLDER,
} from 'organization/Event/SponsorPageConfig/SponsorList/Card'

export default function Sponsor(props: {sponsor: SponsorData}) {
  const {sponsor} = props

  return (
    <Box aria-label="sponsor">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2}>
          <MainImageContainer>
            <Image image={props.sponsor.image} alt={props.sponsor.name} />
          </MainImageContainer>
          <Buttons sponsor={sponsor} />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Body>
            <Name>{props.sponsor.name}</Name>
            <div
              dangerouslySetInnerHTML={{
                __html: props.sponsor.description,
              }}
            />
          </Body>
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

function Image(props: {image: SponsorData['image']; alt: string}) {
  const src = props.image ? props.image.url : SPONSOR_PLACEHOLDER
  return <img src={src} alt={props.alt} />
}

function Buttons(props: {sponsor: SponsorData}) {
  const {
    sponsor: {buttons},
  } = props

  if (!buttons) {
    return null
  }

  return (
    <ButtonsContainer>
      {buttons.ids.map((id) => (
        <ButtonBox key={id}>
          <NavButton key={id} {...buttons.entities[id]} />
        </ButtonBox>
      ))}
    </ButtonsContainer>
  )
}

function QuestionIcon(props: {sponsor: SponsorData}) {
  const {event} = useEvent()
  const {sponsor_question_icon} = event

  const src = sponsor_question_icon
    ? sponsor_question_icon.url
    : SPONSOR_QUESTION_ICON_PLACEHOLDER

  return <img src={src} alt={props.sponsor.name} />
}

const Box = styled.div`
  margin-left: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
`

const ButtonBox = styled.div`
  &:not(:last-child) {
    margin-bottom: ${(props) => props.theme.spacing[1]};
  }
`

const Body = styled.div`
  margin-left: ${(props) => props.theme.spacing[5]};
`

const Name = styled.h5`
  text-transform: capitalize;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
`

const ImageContainer = styled.div`
  img {
    width: 100%;
    max-height: 100%;
  }
`

const MainImageContainer = styled(ImageContainer)`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
