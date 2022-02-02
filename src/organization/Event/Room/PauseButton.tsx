import Button from '@material-ui/core/Button'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import React from 'react'
import {useArea} from 'organization/Event/Area/AreaProvider'

export default function PauseButton(props: {
  processing: boolean
  numAttendees?: number
}) {
  const {room, setPaused, processing} = useRoom()
  const {area} = useArea()
  const showing =
    props.numAttendees !== 0 && area.is_tech_check && room.is_online

  if (!showing) {
    return null
  }

  if (room.is_paused) {
    return (
      <Button
        variant="contained"
        color="primary"
        aria-label="unpause room"
        disabled={processing}
        onClick={() => {
          setPaused(false)
        }}
      >
        Unpause Room
      </Button>
    )
  }

  return (
    <Button
      variant="contained"
      color="primary"
      aria-label="pause room"
      disabled={processing}
      onClick={() => {
        setPaused(true)
      }}
    >
      Pause Room
    </Button>
  )
}
