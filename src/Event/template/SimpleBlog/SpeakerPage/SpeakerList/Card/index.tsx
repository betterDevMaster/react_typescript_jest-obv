import React from 'react'
import styled from 'styled-components'
import Grid, {GridSize} from '@material-ui/core/Grid'
import {useTemplate} from 'Event/TemplateProvider'
import Image from 'Event/template/SimpleBlog/SpeakerPage/SpeakerList/Card/Image'
import Body from 'Event/template/SimpleBlog/SpeakerPage/SpeakerList/Card/Body'
import {Speaker} from 'Event/SpeakerPage'
import {useSpeakers} from 'organization/Event/SpeakersProvider'
import Clickable from 'lib/ui/Editable'
import {DEFAULT_SPEAKER_IMAGE_SIZE} from 'organization/Event/SpeakerPageConfig/SpeakerPageEditDialog/Form'

type SpeakerProps = {
  speaker: Speaker
  isEditMode?: boolean
}

export default function Card(props: {speaker: Speaker; isEditMode?: boolean}) {
  if (props.isEditMode) {
    return <Editable {...props} />
  }

  return <Content {...props} />
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

  const template = useTemplate()

  const imageSize =
    template.speakers?.speakerImageSize || DEFAULT_SPEAKER_IMAGE_SIZE
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
