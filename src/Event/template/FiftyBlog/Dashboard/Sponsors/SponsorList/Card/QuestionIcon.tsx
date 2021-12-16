import React from 'react'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import {SPONSOR_QUESTION_ICON_PLACEHOLDER} from 'Event/template/FiftyBlog/Dashboard/Sponsors/SponsorList/Card/Body'
import {useEvent} from 'Event/EventProvider'

export default function QuestionIcon(props: {
  sponsor: Sponsor
  onClick: () => void
  className?: string
}) {
  const {event} = useEvent()
  const {sponsor_question_icon} = event

  if (!props.sponsor.form) {
    return null
  }

  const src = sponsor_question_icon
    ? sponsor_question_icon.url
    : SPONSOR_QUESTION_ICON_PLACEHOLDER

  return (
    <Box
      onClick={props.onClick}
      aria-label="sponsor questions"
      className={props.className}
    >
      <img src={src} alt={props.sponsor.name} />
    </Box>
  )
}

const Box = styled.div`
  width: 20%;
  max-width: 80px;
  cursor: pointer;

  img {
    width: 100%;
    max-height: 100%;
  }
`
