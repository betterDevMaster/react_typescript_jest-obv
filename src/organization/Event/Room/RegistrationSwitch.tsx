import Switch from '@material-ui/core/Switch'
import {onChangeCheckedHandler} from 'lib/dom'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import React from 'react'

export default function RegistrationSwitch() {
  const {room, processing, toggleRegistration} = useRoom()

  return (
    <Switch
      checked={room.has_registration}
      disabled={processing}
      onChange={onChangeCheckedHandler(toggleRegistration)}
      color="primary"
      inputProps={{
        'aria-label': 'toggle registration',
      }}
    />
  )
}
