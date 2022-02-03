import React from 'react'
import styled, {useTheme} from 'styled-components'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import CustomButton from 'lib/ui/Button/CustomButton'
import {Label} from 'lib/ui/typography'
import Select from 'lib/ui/Select'
import Option from 'lib/ui/Select/Option'
import {Room} from 'Event/room'
import {Area} from 'organization/Event/AreasProvider'
import {Attendee} from 'Event/attendee'
import {RoomAssignment} from 'organization/Event/AttendeeManagement/AssignmentsDialog/RoomSelect'

type AttendeeProps = {
  attendee: Attendee
  currentPoints: number
  areas: Area[]
  roomAssignments: RoomAssignment[]
  onChangeRoom: (attendeeId: number, areaId: number, roomId: number) => void
}

export default function AttendeeDetail(props: AttendeeProps) {
  const {attendee, currentPoints, areas, onChangeRoom, roomAssignments} = props
  const {id, email} = attendee

  return (
    <Container container>
      <Item item xs={12} showOnlyInSmallScreen>
        <Box display="flex" justifyContent="flex-end">
          <Button fullWidth>Check-in</Button>
        </Box>
      </Item>
      <Item item xs={12} sm={12}>
        <Box display="flex" flexDirection="column" gridGap="10px">
          <Label>Email</Label>
          <BlueLabel>{email}</BlueLabel>
        </Box>
      </Item>
      <Item item xs={12} sm={12} hideInSmallScreen>
        <Box display="flex" justifyContent="flex-end">
          <Button>Check-in</Button>
        </Box>
      </Item>
      <Item item xs={6}>
        <Box display="flex" flexDirection="column" gridGap="10px">
          <Label>Current Points</Label>
          <BlueLabel>{currentPoints.toLocaleString()}</BlueLabel>
        </Box>
      </Item>
      <Item item xs={6}>
        <Box display="flex" justifyContent="flex-end">
          <Button>Edit</Button>
        </Box>
      </Item>
      <Item item xs={12} noBorder>
        <Row noBorder>
          <RowItem>
            <Label>Area</Label>
          </RowItem>
          <RowItem last>
            <Label>Room</Label>
          </RowItem>
        </Row>
        <ListContainer>
          {areas.map((area: Area, index: number) => {
            const {name, rooms} = area
            const noBorder = index === areas.length - 1
            const roomAssignedArea = roomAssignments.filter(
              (roomAssignment) => roomAssignment.area_id === area.id,
            )
            const assignedRoomId = roomAssignedArea?.[0]?.room_id || 0

            return (
              <Row key={index} noBorder={noBorder}>
                <RowItem>
                  <Label>{name}</Label>
                </RowItem>
                <RowItem last>
                  <Select
                    value={assignedRoomId}
                    onChange={(value: string) =>
                      onChangeRoom(id, area.id, parseInt(value))
                    }
                  >
                    {rooms.map((room: Room, index: number) => {
                      return (
                        <Option key={index} value={room.id}>
                          {room.number}
                        </Option>
                      )
                    })}
                  </Select>
                </RowItem>
              </Row>
            )
          })}
        </ListContainer>
      </Item>
    </Container>
  )
}

const Container = styled(Grid)`
  padding: 0 10px;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 0 0;
  }
`

type ItemProps = {
  noBorder?: boolean
  hideInSmallScreen?: boolean
  showOnlyInSmallScreen?: boolean
}

const Item = styled(Grid)<ItemProps>`
  padding: 20px 10px;
  border-bottom: 1px solid #f1f1f1;
  border-bottom-width: ${(props) => (props.noBorder ? '0' : '1px')};
  display: ${(props) => (props.showOnlyInSmallScreen ? 'none' : 'block')};
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: ${(props) => (props.hideInSmallScreen ? 'none' : 'block')};
  }
`

const BlueLabel = styled(Label)`
  color: ${(props) => props.theme.colors.primary};
`

const ListContainer = styled(Box)`
  border: 1px solid ${(props) => props.theme.colors.gray};
`

type RowProps = {
  noBorder?: boolean
}

const Row = styled(Box)<RowProps>`
  padding: 14px 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray};
  border-bottom-width: ${(props) => (props.noBorder ? '0' : '1px')};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

type RowItemProps = {
  last?: boolean
}

const RowItem = styled(Box)<RowItemProps>`
  padding: 0 14px;
  width: 50%;
  display: flex;
  justify-content: 'flex-start';
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    justify-content: ${(props) => (props.last ? 'flex-end' : 'flex-start')};
  }
`

const Button = (props: {
  children: React.ReactNode
  fullWidth?: boolean
  onClick?: () => void
}) => {
  const theme = useTheme()

  return (
    <StyledCustomButton
      fullWidth={props.fullWidth}
      onClick={props.onClick}
      backgroundColor={theme.colors.primary}
      type="button"
      borderRadius={3}
      fontSize={14}
    >
      {props.children}
    </StyledCustomButton>
  )
}

const StyledCustomButton = styled(CustomButton)`
  padding: 13px 9px;
`
