import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {Sponsor} from 'Event/SponsorPage'
import Typography from '@material-ui/core/Typography'
import Clickable from 'lib/ui/Editable'
import {useSponsors} from 'organization/Event/SponsorsProvider'

export const SPONSOR_QUESTION_ICON_PLACEHOLDER = 'http://placehold.jp/50x50.png'

type BodyProps = {
  sponsor: Sponsor
  isEditMode?: boolean
}

export default function Body(props: BodyProps) {
  if (props.isEditMode) {
    return <Editable {...props} />
  }

  return <Content {...props} />
}

function Editable(props: BodyProps) {
  const {edit} = useSponsors()

  return (
    <>
      <Clickable onClick={() => edit(props.sponsor)}>
        <Content {...props} />
      </Clickable>
    </>
  )
}

function Content(props: BodyProps) {
  const {sponsor} = props

  return (
    <div>
      <SponsorHeader>
        <Typography variant="h5">{sponsor.name}</Typography>
        <QuestionIcon sponsor={sponsor} />
      </SponsorHeader>
      <div
        dangerouslySetInnerHTML={{
          __html: sponsor.description,
        }}
      />
    </div>
  )
}

function QuestionIcon(props: {sponsor: Sponsor}) {
  const {event} = useEvent()
  const {sponsor_question_icon} = event

  if (!props.sponsor.settings?.formId) {
    return null
  }

  const src = sponsor_question_icon
    ? sponsor_question_icon.url
    : SPONSOR_QUESTION_ICON_PLACEHOLDER

  return (
    <QuestionIconBox>
      <img src={src} alt={props.sponsor.name} />
    </QuestionIconBox>
  )
}

const ImageContainer = styled.div`
  img {
    width: 100%;
    max-height: 100%;
  }
`

const QuestionIconBox = styled(ImageContainer)`
  width: 40px;
  margin-right: 10px;
`
const SponsorHeader = styled.div`
  display: flex;
  justify-content: space-between;
`
