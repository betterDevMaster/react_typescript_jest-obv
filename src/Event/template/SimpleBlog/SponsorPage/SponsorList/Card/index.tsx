import React from 'react'
import styled from 'styled-components'
import Grid, {GridSize} from '@material-ui/core/Grid'
import {Sponsor} from 'Event/SponsorPage'
import NavButton from 'Event/Dashboard/components/NavButton'
import {useTemplate} from 'Event/TemplateProvider'
import Image from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card/Image'
import Body from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card/Body'
import {Draggable} from 'react-beautiful-dnd'

export const DEFAULT_SPONSOR_IMAGE_SIZE = 4
export const DEFAULT_DESCRIPTION = ''
export const DEFAULT_BACK_TO_DASHBOARD_TEXT = 'Back to Dashboard'
export const DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR = '#000000'
export const DEFAULT_SPONSORS_SPACE = 0

type SponsorProps = {
  index: number
  sponsor: Sponsor
  isEditMode?: boolean
  className?: string
}

export default function Card(props: SponsorProps) {
  const {sponsor, isEditMode, index} = props

  if (!isEditMode) {
    return <Content {...props} />
  }

  return (
    <Draggable draggableId={String(sponsor.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className={props.className}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Content {...props} />
        </div>
      )}
    </Draggable>
  )
}

function Content(props: SponsorProps) {
  const {sponsor} = props
  const template = useTemplate()

  const imageSize = template.sponsors?.imageSize || DEFAULT_SPONSOR_IMAGE_SIZE
  const contentSize = (12 - imageSize) as GridSize

  return (
    <Box aria-label="sponsor" className={props.className}>
      <Grid container spacing={2}>
        <Left item xs={12} sm={imageSize}>
          <StyledImage sponsor={sponsor} isEditMode={props.isEditMode} />
          <Buttons sponsor={props.sponsor} />
        </Left>
        <RightGrid item xs={12} sm={contentSize}>
          <StyledBody sponsor={sponsor} isEditMode={props.isEditMode} />
        </RightGrid>
      </Grid>
    </Box>
  )
}

function Buttons(props: {sponsor: Sponsor}) {
  const buttons = props.sponsor.settings?.buttons

  if (!buttons) {
    return null
  }

  return (
    <>
      {buttons.ids.map((id) => (
        <ButtonBox key={id}>
          <NavButton {...buttons.entities[id]} aria-label="sponsor button" />
        </ButtonBox>
      ))}
    </>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
`

const StyledBody = styled(Body)`
  margin-left: ${(props) => props.theme.spacing[5]};
`

const ButtonBox = styled.div`
  & button {
    margin: auto;
  }

  &:not(:last-child) {
    margin-bottom: ${(props) => props.theme.spacing[2]};
  }
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
