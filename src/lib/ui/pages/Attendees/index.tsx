import React from 'react'
import {Attendee} from 'Event/attendee'

import Header from 'lib/ui/pages/Header'
import Grid from 'lib/ui/Grid'
import SearchTextField from 'lib/ui/TextField/SearchTextField'
import Button from 'lib/ui/Button'
import Pagination from 'lib/ui/Pagination'
import Accordion from 'lib/ui/Accordion'
import AccordionDetails from 'lib/ui/Accordion/AccordionDetails'
import AccordionSummary from 'lib/ui/Accordion/AccordionSummary'
import AttendeeDetail from 'lib/ui/Attendee'
import {Area} from 'organization/Event/AreasProvider'
import {RoomAssignment} from 'organization/Event/AttendeeManagement/AssignmentsDialog/RoomSelect'
import styled from 'styled-components'
import {Hidden} from '@material-ui/core'
import Heading3 from 'lib/ui/typography/Heading3'

/**
 * attendees: an array of attendees
 * areas: an array of areas that could be fetched by a hook
 * roomAssignments: two dimentional array of room_assignments according to attendee.
 * currentPoints: an array of points for attendees
 */
export type AttendeesProps = {
  attendees: Attendee[]
  areas: Area[]
  roomAssignments: RoomAssignment[][]
  currentPoints: number[]
}

export default function Attendees(props: AttendeesProps) {
  const smGridSize = 12
  const mdGridSize = 8

  const {areas} = props

  const onChangeRoom = (attendeeId: number, areaId: number, roomId: number) => {
    console.log(attendeeId, areaId, roomId)
  }

  const {roomAssignments, currentPoints} = props

  return (
    <Grid container>
      <Grid item xs={smGridSize} sm={mdGridSize}>
        <Header
          title="Attendees"
          description="“Short description of what Attendees are used for and how they work.”"
        />
      </Grid>
      <Grid item xs={smGridSize} sm={mdGridSize}>
        <SearchTextFieldContainer>
          <SearchTextField />
        </SearchTextFieldContainer>
      </Grid>
      <ButtonContainer xs={smGridSize} md={mdGridSize}>
        <Grid container justify="space-between">
          <Grid item xs={12} sm={8} container justify="space-between">
            <AddAtteendeeButton variant="contained" color="primary">
              Add Attendee
            </AddAtteendeeButton>
            <Hidden xsDown>
              <Button variant="outlined" color="primary">
                Import
              </Button>
              <Button variant="outlined" color="primary">
                Export
              </Button>
              <Button variant="outlined" color="primary">
                Export Waivers
              </Button>
            </Hidden>
          </Grid>
          <Grid item xs={12} sm={4} container justify="flex-end">
            <StyledPaginationBox>
              <Pagination count={2} page={1} onChange={() => {}} />
            </StyledPaginationBox>
          </Grid>
        </Grid>
      </ButtonContainer>
      <Grid item xs={smGridSize} md={mdGridSize}>
        <NameBox>
          <AccordionSummary>
            <Heading3>Name</Heading3>
          </AccordionSummary>
        </NameBox>
      </Grid>
      <Grid item xs={smGridSize} md={mdGridSize}>
        {props.attendees.map((attendee, index) => (
          <Accordion key={index} id={`${attendee.id}`}>
            <AccordionSummary expandedIconName="menu">
              <Heading3>
                {attendee.first_name} {attendee.last_name}
              </Heading3>
            </AccordionSummary>
            <AccordionDetails>
              <AttendeeDetail
                attendee={attendee}
                areas={areas}
                currentPoints={currentPoints[index]}
                roomAssignments={roomAssignments[index]}
                onChangeRoom={onChangeRoom}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  )
}

const ButtonContainer = styled(Grid)`
  margin-top: ${(props) => props.theme.spacing[5]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

const SearchTextFieldContainer = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 400px;
  }
`

const NameBox = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.125);
  min-height: 56px;
  width: 100%;
`
const AddAtteendeeButton = styled(Button)`
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`
const StyledPaginationBox = styled.div`
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
    margin-top: ${(props) => props.theme.spacing[11]};
    margin-bottom: ${(props) => props.theme.spacing[8]};
  }
`
