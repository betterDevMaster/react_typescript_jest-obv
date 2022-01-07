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
  const {speakers} = useNiftyFiftyTemplate()
  const v = useAttendeeVariables()
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))

  const imageSize = speakers.speakerImageSize
  const isFirst = props.index === 0

  return (
    <Box
      aria-label="speaker"
      isFirst={isFirst}
      backgroundColor={rgba(
        speaker.backgroundColor || '#FFFFFF',
        speaker.backgroundOpacity || 0,
      )}
      isXSMobile={isXSMobile}
    >
      <Left item xs={imageSize}>
        <StyledImage speaker={speaker} />
      </Left>
      <SpeakerName
        color={speakers.titleColor}
        fontSize={speakers.titleFontSize}
      >
        {v(speaker.name)}
      </SpeakerName>
      <StyledBody
        color={speakers.titleDescColor}
        fontSize={speakers.titleDescFontSize}
      >
        <InnerContent>{v(speaker.text)}</InnerContent>
      </StyledBody>
    </Box>
  )
}

const Box = styled.div<{
  isFirst: boolean
  isXSMobile: boolean
  backgroundColor: string
}>`
  position: relative;
  border-top: ${(props) => (props.isFirst ? 'none' : '1px solid #e5e5e5')};
  padding: ${(props) =>
    props.isXSMobile ? props.theme.spacing[4] : props.theme.spacing[6]} 
    ${(props) =>
      props.isXSMobile ? props.theme.spacing[8] : props.theme.spacing[12]};};
  background: ${(props) => props.backgroundColor};
`

const StyledBody = styled.div<{
  color: string
  fontSize: number
}>`
  margin-top: ${(props) => props.theme.spacing[1]};
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.color};
  white-space: pre-wrap;
`

const Left = styled(Grid)``

const SpeakerName = styled.div<{
  color: string
  fontSize: number
}>`
  line-height: 22px;
  font-weight: 700;
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.color};
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 17px;
  }
`

const StyledImage = styled(Image)`
  float: left;
  margin: ${(props) =>
    `${props.theme.spacing[5]} ${props.theme.spacing[4]} ${props.theme.spacing[4]} 0`};
`
