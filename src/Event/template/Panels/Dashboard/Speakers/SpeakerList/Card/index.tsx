import React from 'react'
import styled from 'styled-components'
import Grid, {GridSize} from '@material-ui/core/Grid'
import Image from 'Event/template/Panels/Dashboard/Speakers/SpeakerList/Card/Image'
import Body from 'Event/template/Panels/Dashboard/Speakers/SpeakerList/Card/Body'
import {Speaker} from 'Event/SpeakerPage'
import {useSpeakers} from 'organization/Event/SpeakersProvider'
import Clickable from 'lib/ui/Clickable'
import {DEFAULT_SPEAKER_IMAGE_SIZE} from 'Event/template/Panels/Dashboard/Speakers/SpeakerPageConfig/SpeakerPageEditDialog/Form'
import {Draggable} from 'react-beautiful-dnd'
import {usePanels} from 'Event/template/Panels'
import {useVariables} from 'Event'

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
  const {template} = usePanels()
  const v = useVariables()

  const imageSize =
    template.speakers?.speakerImageSize || DEFAULT_SPEAKER_IMAGE_SIZE
  const contentSize = (12 - imageSize) as GridSize

  const isFirst = props.index === 0

  return (
    <Box aria-label="speaker" isFirst={isFirst}>
      <Grid container spacing={2}>
        <Left item xs={imageSize}>
          <StyledImage speaker={speaker} />
          <SpeakerName>{v(speaker.name)}</SpeakerName>
        </Left>
        <RightGrid item xs={contentSize}>
          <StyledBody speaker={speaker} />
        </RightGrid>
      </Grid>
    </Box>
  )
}

const Box = styled.div<{
  isFirst: boolean
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  border-top: ${(props) => (props.isFirst ? 'none' : '1px solid #e5e5e5')};
  padding: ${(props) => (props.isFirst ? '0 0 30px' : '30px 0px')};
`

const StyledBody = styled(Body)`
  margin-left: ${(props) => props.theme.spacing[5]};
`

const Left = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const SpeakerName = styled.div`
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 17px;
  }
`

const RightGrid = styled(Grid)`
  display: flex;
  justify-content: space-between;
`

const StyledImage = styled(Image)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
