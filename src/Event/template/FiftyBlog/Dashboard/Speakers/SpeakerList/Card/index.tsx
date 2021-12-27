import React from 'react'
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import Grid, {GridSize} from '@material-ui/core/Grid'

import {useAttendeeVariables} from 'Event'
import Image from 'Event/template/FiftyBlog/Dashboard/Speakers/SpeakerList/Card/Image'
import {Speaker} from 'Event/SpeakerPage'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'

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
    <>
      <Clickable onClick={() => edit(props.speaker)}>
        <Content {...props} />
      </Clickable>
    </>
  )
}

function Content(props: SpeakerProps) {
  const {speaker} = props
  const {speakers} = useFiftyBlogTemplate()
  const v = useAttendeeVariables()

  const imageSize = speakers.speakerImageSize
  const contentSize = (12 - imageSize) as GridSize

  const isFirst = props.index === 0

  return (
    <Box aria-label="speaker" isFirst={isFirst}>
      <Grid container spacing={2}>
        <Left item xs={imageSize}>
          <StyledImage speaker={speaker} />
        </Left>
        <RightGrid item xs={contentSize}>
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
        </RightGrid>
      </Grid>
      <StyledBody
        color={speakers.descriptionColor}
        fontSize={speakers.descriptionFontSize}
      >
        <InnerContent>{v(speaker.description)}</InnerContent>
      </StyledBody>
    </Box>
  )
}

const Box = styled.div<{
  isFirst: boolean
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  border-top: ${(props) => (props.isFirst ? 'none' : '1px solid #e5e5e5')};
  padding: ${(props) => (props.isFirst ? '0 0 30px' : '30px 0px')};
`

const StyledBody = styled.div<{
  color: string
  fontSize: number
}>`
  margin-top: ${(props) => props.theme.spacing[1]};
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.color};
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

const RightGrid = styled(Grid)``

const StyledImage = styled(Image)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
