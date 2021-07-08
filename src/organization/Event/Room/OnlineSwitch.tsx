import Switch from '@material-ui/core/Switch'
import {useEvent} from 'Event/EventProvider'
import {onChangeCheckedHandler} from 'lib/dom'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import {useCanStartRooms} from 'organization/PermissionsProvider'
import React from 'react'

export default function OnlineSwitch() {
  const {room, processing, setOnline} = useRoom()
  const {event} = useEvent()

  const canStartRooms = useCanStartRooms()

  const canStart = !processing && canStartRooms && !event.has_ended

  return (
    <Switch
      checked={room.is_online}
      disabled={!canStart}
      onChange={onChangeCheckedHandler(setOnline)}
      color="primary"
      inputProps={{
        'aria-label': 'toggle online',
      }}
    />
  )
}
