import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import React from 'react'
import {Rule, useRules} from 'organization/Event/Area/Rules/RulesProvider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import {onChangeCheckedHandler} from 'lib/dom'
import {Room} from 'Event/room'
import {useRooms} from 'organization/Event/Area/RoomsProvider'

export default function RoomsConfig(props: {
  showing: boolean
  onClose: () => void
  rule: Rule
}) {
  const {rule, showing, onClose} = props
  const list = useRules()

  const setRooms = (rooms: Rule['rooms'][0][]) => {
    const updated: Rule = {
      ...rule,
      rooms,
    }

    list.update(updated)
  }

  return (
    <Dialog open={showing} onClose={onClose} fullWidth>
      <DialogTitle>Rooms</DialogTitle>
      <DialogContent>
        <RoomsList onChange={setRooms} rule={rule} />
      </DialogContent>
    </Dialog>
  )
}

function RoomsList(props: {
  rule: Rule
  onChange: (rooms: Rule['rooms'][0][]) => void
}) {
  const {rule, onChange} = props
  const {rooms} = useRooms()
  const {processing} = useRules()

  if (!rooms || rooms.length === 0) {
    return <p>No rooms have been created</p>
  }

  const isSelected = (room: Room) => rule.rooms.includes(room.id)

  const handleSelect = (room: Room) => (selected: boolean) => {
    if (selected) {
      onChange([...rule.rooms, room.id])
      return
    }

    const removed = rule.rooms.filter((i) => i !== room.id)
    onChange(removed)
  }

  return (
    <>
      {rooms.map((room) => (
        <div key={room.id}>
          <FormControlLabel
            label={room.name}
            control={
              <Checkbox
                disableRipple
                disabled={processing}
                checked={isSelected(room)}
                onChange={onChangeCheckedHandler(handleSelect(room))}
                inputProps={{
                  'aria-label': `${isSelected(room) ? 'unselect' : 'select'} ${
                    room.name
                  }`,
                }}
              />
            }
          />
        </div>
      ))}
    </>
  )
}
