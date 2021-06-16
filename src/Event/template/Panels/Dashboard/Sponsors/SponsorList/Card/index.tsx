import React, {useState} from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import {Sponsor} from 'Event/SponsorPage'
import Image from 'Event/template/Panels/Dashboard/Sponsors/SponsorList/Card/Image'
import Body from 'Event/template/Panels/Dashboard/Sponsors/SponsorList/Card/Body'
import {Draggable} from 'react-beautiful-dnd'
import SponsorForm from 'Event/template/Panels/Dashboard/Sponsors/SponsorList/Card/SponsorForm'

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
  const [formVisible, setFormVisible] = useState(false)
  const toggleForm = () => setFormVisible(!formVisible)

  return (
    <StyledPaper aria-label="sponsor">
      <SponsorForm
        sponsor={sponsor}
        visible={formVisible}
        isEditMode={props.isEditMode}
        onClose={toggleForm}
      />
      <StyledGrid container>
        <Grid item xs={12}>
          <StyledImage sponsor={sponsor} isEditMode={props.isEditMode} />
        </Grid>
        <Grid item xs={12}>
          <Body
            sponsor={sponsor}
            isEditMode={props.isEditMode}
            toggleForm={toggleForm}
          />
        </Grid>
        <Grid item xs={12}>
          <VisitBoothButton sponsor={sponsor} onClick={toggleForm} />
        </Grid>
      </StyledGrid>
    </StyledPaper>
  )
}

function VisitBoothButton(props: {sponsor: Sponsor; onClick: () => void}) {
  if (!props.sponsor.form) {
    return null
  }

  return (
    <Box>
      <Button
        variant="outlined"
        color="primary"
        aria-label="visit the booth"
        onClick={props.onClick}
      >
        Visit The Booth
      </Button>
    </Box>
  )
}

const StyledGrid = styled(Grid)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledPaper = styled(Paper)`
  height: 100%;
  padding: ${(props) => props.theme.spacing[4]};
`

const StyledImage = styled(Image)`
  width: 100%;
`

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
