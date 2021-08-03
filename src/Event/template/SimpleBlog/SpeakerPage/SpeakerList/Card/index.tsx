import React from 'react'
import styled from 'styled-components'
import Grid, {GridSize} from '@material-ui/core/Grid'
import Image from 'Event/template/SimpleBlog/SpeakerPage/SpeakerList/Card/Image'
import Body from 'Event/template/SimpleBlog/SpeakerPage/SpeakerList/Card/Body'
import {Speaker} from 'Event/SpeakerPage'
import {useSpeakers} from 'organization/Event/SpeakersProvider'
import Clickable from 'lib/ui/Clickable'
import {Draggable} from 'react-beautiful-dnd'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

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
  const {template} = useSimpleBlog()

  const imageSize = template.speakers.speakerImageSize
  const contentSize = (12 - imageSize) as GridSize

  return (
    <Box aria-label="speaker">
      <Grid container spacing={2}>
        <Left item xs={12} sm={imageSize}>
          <StyledImage speaker={speaker} />
        </Left>
        <RightGrid item xs={12} sm={contentSize}>
          <StyledBody speaker={speaker} />
        </RightGrid>
      </Grid>
    </Box>
  )
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
`

const StyledBody = styled(Body)`
  margin-left: ${(props) => props.theme.spacing[5]};
`

const Left = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const RightGrid = styled(Grid)`
  display: flex;
  justify-content: space-between;
`

const StyledImage = styled(Image)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
