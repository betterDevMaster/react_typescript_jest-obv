import Switch from '@material-ui/core/Switch'
import {onChangeCheckedHandler} from 'lib/dom'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import {START_ROOMS, usePermissions} from 'organization/PermissionsProvider'
import React from 'react'

export default function RoomOnlineSwitch() {
  const {room, processing, setOnline} = useRoom()
  const {can} = usePermissions()

  return (
    <Switch
      checked={room.is_online}
      disabled={processing || !can(START_ROOMS)}
      onChange={onChangeCheckedHandler(setOnline)}
      color="primary"
      inputProps={{
        'aria-label': 'toggle online',
      }}
    />
  )
}
