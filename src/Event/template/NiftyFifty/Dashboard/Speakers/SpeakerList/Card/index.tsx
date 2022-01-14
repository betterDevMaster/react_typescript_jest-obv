import React from 'react'
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components'

import {Grid, useTheme, useMediaQuery} from '@material-ui/core'

import {useAttendeeVariables} from 'Event'
import Image from 'Event/template/NiftyFifty/Dashboard/Speakers/SpeakerList/Card/Image'
import {Speaker} from 'Event/SpeakerPage'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {rgba} from 'lib/color'
import InnerContent from 'lib/ui/form/TextEditor/Content'
import Clickable from 'lib/ui/Clickable'
import ClearContent from 'lib/ui/layout/ClearContent'

import {useSpeakers} from 'organization/Event/SpeakersProvider'

type SpeakerProps = {
  index: number
  speaker: Speaker
  isEditMode?: boolean
}

export default function Card(props: SpeakerProps) {
  if (!props.isEditMode) {
    return <Content {...props} />
  }
  return (
    <Draggable draggableId={String(props.speaker.id)} index={props.index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Editable {...props} />
        </div>
      )}
    </Draggable>
  )
}

function Editable(props: SpeakerProps) {
  const {edit} = useSpeakers()

  return (
    <Clickable onClick={() => edit(props.speaker)}>
      <Content {...props} />
    </Clickable>
  )
}

function Content(props: SpeakerProps) {
  const {speaker} = props
  const template = useNiftyFiftyTemplate()
  const v = useAttendeeVariables()
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))

  const backgroundColor =
    props.index % 2 === 0
      ? rgba(
          template.speakers.evenBackgroundColor,
          template.speakers.evenBackgroundOpacity,
        )
      : rgba(
          template.speakers.oddBackgroundColor,
          template.speakers.oddBackgroundOpacity,
        )

  return (
    <Box
      aria-label="speaker"
      backgroundColor={backgroundColor}
      isXSMobile={isXSMobile}
    >
      <Grid item xs={template.speakers.speakerImageSize}>
        <StyledImage speaker={speaker} />
      </Grid>
      <SpeakerName color={template.textColor}>{v(speaker.name)}</SpeakerName>
      <StyledBody color={template.textColor}>
        <InnerContent>{v(speaker.text)}</InnerContent>
      </StyledBody>
      <ClearContent />
    </Box>
  )
}

const Box = styled.div<{
  isXSMobile: boolean
  backgroundColor: string
}>`
  background: ${(props) => props.backgroundColor};
  padding: ${(props) =>
    props.isXSMobile ? props.theme.spacing[4] : props.theme.spacing[6]} 
    ${(props) =>
      props.isXSMobile ? props.theme.spacing[8] : props.theme.spacing[12]}};
  position: relative;
`

const StyledBody = styled.div<{
  color: string
}>`
  margin-top: ${(props) => props.theme.spacing[1]};
  color: ${(props) => props.color};
  white-space: pre-wrap;
  list-style-position: inside;
`

const SpeakerName = styled.div<{
  color: string
}>`
  line-height: 22px;
  font-weight: 700;
  font-size: 18px;
  color: ${(props) => props.color};
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 17px;
  }
`

const StyledImage = styled(Image)`
  float: left;
  margin: ${(props) =>
    `0 ${props.theme.spacing[4]} ${props.theme.spacing[4]} 0`};
  width: 100%;
`
