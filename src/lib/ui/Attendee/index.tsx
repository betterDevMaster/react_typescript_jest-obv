import React from 'react'
import styled, {useTheme} from 'styled-components'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import CustomButton from 'lib/ui/Button/CustomButton'
import {Label} from 'lib/ui/typography'
import Select from 'lib/ui/Select'
import Option from 'lib/ui/Select/Option'

type Room = {
  label: string
  value: number | string
}

type Area = {
  id: number
  label: string
  room?: Room
}

type AttendeeProps = {
  id: number
  name: string
  email: string
  currentPoints: number
  areas: Area[]
  rooms: Room[]
  onChangeRoom: (attendeeId: number, areaId: number, roomId: number) => void
}

export default function Attendee(props: AttendeeProps) {
  const {id, email, currentPoints, areas, rooms, onChangeRoom} = props

  return (
    <Container container>
      <Item item xs={12} showOnlyInSmallScreen>
        <Box display="flex" justifyContent="flex-end">
          <Button fullWidth>Check-in</Button>
        </Box>
      </Item>
      <Item item xs={12} sm={6}>
        <Box display="flex" flexDirection="column" gridGap="10px">
          <Label>Email</Label>
          <BlueLabel>{email}</BlueLabel>
        </Box>
      </Item>
      <Item item xs={12} sm={6} hideInSmallScreen>
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
            const {label, room} = area
            const noBorder = index === areas.length - 1

            return (
              <Row key={index} noBorder={noBorder}>
                <RowItem>
                  <Label>{label}</Label>
                </RowItem>
                <RowItem last>
                  <Select
                    value={room?.value || 0}
                    onChange={(value: string) =>
                      onChangeRoom(id, area.id, parseInt(value))
                    }
                  >
                    {rooms.map((room: Room, index: number) => {
                      return (
                        <Option key={index} value={room.value}>
                          {room.label}
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
