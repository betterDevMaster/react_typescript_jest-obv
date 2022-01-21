import React from 'react'
import Box from '@material-ui/core/Box'
import Header from './Header'
import Options from './Options'
import RoomList from './RoomsList'

export interface Room {
  name: string
  maxAttendees: number
  disabled?: boolean
}

export type AreaSettingsProps = {
  open: boolean
  reassignOnOffline: boolean
  requireApproval: boolean
  joinMultipleDevices: boolean
  rooms: Room[]
}

export default function AreaSettings(props: AreaSettingsProps) {
  const {
    open,
    reassignOnOffline,
    requireApproval,
    joinMultipleDevices,
    rooms,
  } = props

  return (
    <Box>
      <Header />
      <Options
        open={open}
        reassignOnOffline={reassignOnOffline}
        requireApproval={requireApproval}
        joinMultipleDevices={joinMultipleDevices}
      />
      <RoomList rooms={rooms} />
    </Box>
  )
}
