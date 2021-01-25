import Button from '@material-ui/core/Button'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import React from 'react'

export default function StartButton() {
  const {room, start} = useRoom()
  return (
    <Button
      disabled={!room.is_online}
      onClick={start}
      color="secondary"
      variant="outlined"
      aria-label="start room"
    >
      Start
    </Button>
  )
}
