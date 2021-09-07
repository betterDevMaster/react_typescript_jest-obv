import {useRooms} from 'organization/Event/Area/RoomsProvider'
import {Rule} from 'organization/Event/Area/Rules/RulesProvider'
import {List} from 'organization/Event/Area/Rules/RulesTable'
import React from 'react'

export default function Rooms(props: {rule: Rule}) {
  const {rule} = props

  const hasRooms = rule.rooms.length > 0
  if (!hasRooms) {
    return <em>None</em>
  }

  return (
    <List>
      {rule.rooms.map((id) => (
        <li key={id}>
          <RoomName id={id} />
        </li>
      ))}
    </List>
  )
}

function RoomName(props: {id: Rule['rooms'][0]}) {
  const {rooms} = useRooms()
  if (!rooms) {
    return null
  }

  const target = rooms.find((r) => r.id === props.id)
  if (!target) {
    return <em>Room deleted</em>
  }

  return <span>{target.name}</span>
}
