import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Button from 'lib/ui/Button'
import {Text} from 'lib/ui/typography'
import {Room} from 'lib/ui/AreaSettings'
import RoomItem from 'lib/ui/AreaSettings/RoomItem'
import ExportIcon from 'assets/images/ui/icons/export-list.svg'

export type RoomsListProps = {
  rooms: Room[]
}

export default function RoomsList(props: RoomsListProps) {
  const {rooms} = props

  return (
    <Box>
      <FlexBox>
        <LeftBox>
          <Button
            className="add-room"
            variant="contained"
            color="primary"
            borderWidth={1}
          >
            Add Room
          </Button>
          <Button variant="outlined" color="accent" borderWidth={1}>
            Clear Room Assignments
          </Button>
        </LeftBox>
        <RightBox>
          <ExportText>Export List</ExportText>
          <ExportButton variant="text" color="primary">
            <img src={ExportIcon} alt="export-list" />
          </ExportButton>
        </RightBox>
      </FlexBox>
      <RoomsListContainer>
        <RoomItem isHeader />
        {rooms.map((room) => (
          <RoomItem room={room} key={room.name} />
        ))}
      </RoomsListContainer>
    </Box>
  )
}

const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${(props) => props.theme.spacing[4]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-bottom: ${(props) => props.theme.spacing[8]} !important;
  }
`

const LeftBox = styled(Box)`
  display: flex;
  align-items: center;

  .add-room {
    margin-right: ${(props) => props.theme.spacing[5]} !important;
  }
`

const RightBox = styled(Box)`
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`

const ExportText = styled(Text)`
  color: ${(props) => props.theme.colors.gray200};
  margin-right: ${(props) => props.theme.spacing[3]} !important;
`

const ExportButton = styled(Button)`
  padding: 0 !important;
`

const RoomsListContainer = styled(Box)`
  border: 1px solid ${(props) => props.theme.colors.gray300} !important;
  border-bottom: none !important;
`
