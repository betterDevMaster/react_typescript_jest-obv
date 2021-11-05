import {
  CreditTransaction,
  AdditionalRoomsTransaction,
  AttendeesTransaction,
} from 'obvio/Billing/CreditTransactions'
import React from 'react'

export default function TransactionDetails(props: {
  transaction: CreditTransaction
}) {
  const {transaction} = props

  switch (transaction.type_id) {
    case 1:
      return <AttendeeDetails transaction={transaction} />
    case 2:
      return <AdditionalRoomDetails transaction={transaction} />
    default:
      throw new Error(
        `Transaction details missing for type id: ${props.transaction.type_id}`,
      )
  }
}

function AttendeeDetails(props: {transaction: AttendeesTransaction}) {
  const {
    transaction: {details},
  } = props

  const numAttendees = details.num_attendees
  const attendeesLabel = numAttendees > 1 ? 'Attendees' : 'Attendee'

  const numDays = details.duration_days
  const daysLabel = numDays > 1 ? 'Days' : 'Day'

  return (
    <span>
      {numAttendees} {attendeesLabel} for {numDays} {daysLabel}
    </span>
  )
}

function AdditionalRoomDetails(props: {
  transaction: AdditionalRoomsTransaction
}) {
  const {
    transaction: {details},
  } = props

  const numRooms = details.num_rooms
  const roomsLabel = numRooms > 1 ? 'Rooms' : 'Room'

  return (
    <span>
      {numRooms} {roomsLabel}
    </span>
  )
}
