import Switch from '@material-ui/core/Switch'
import {onChangeCheckedHandler} from 'lib/dom'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import React from 'react'

export default function RoomOnlineSwitch() {
  const {room, processing, setOnline} = useRoom()

  return (
    <Switch
      checked={room.is_online}
      disabled={processing}
      onChange={onChangeCheckedHandler(setOnline)}
      color="primary"
      inputProps={{
        'aria-label': 'toggle online',
      }}
    />
  )
}
