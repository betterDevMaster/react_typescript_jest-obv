import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import {getNumDays} from 'lib/date-time'
import {api} from 'lib/url'
import {EventCreditTransaction} from 'obvio/Billing/CreditTransactions'
import {
  Details,
  formattedDate,
  Body,
} from 'obvio/Billing/CreditTransactions/TransactionRow'
import {teamMemberClient} from 'obvio/obvio-client'
import React, {useCallback} from 'react'

export type EventCreditTransactionTotals = {
  num_attendees: number
  cost_attendees: number
  num_additional_rooms: number
  cost_additional_rooms: number
}

export default function EventRow(props: {transaction: EventCreditTransaction}) {
  const {transaction} = props
  const fetch = useFetchDetails(transaction)

  const days = getNumDays(transaction.event_start, transaction.event_end)
  const dayLabel = days > 1 ? 'Days' : 'Day'

  const attendeeLabel = (totals: EventCreditTransactionTotals) =>
    totals.num_attendees > 1 ? 'Attendees' : 'Attendee'

  return (
    <Body
      aria-label="view event totals"
      transaction={transaction}
      title={transaction.event_name}
      details={(showing) => (
        <Details showing={showing} fetch={fetch}>
          {(totals) => (
            <>
              <TableRow>
                <TableCell>{/* Date Column */}</TableCell>
                <TableCell>
                  {totals.num_attendees} {attendeeLabel(totals)}
                </TableCell>
                <TableCell>({totals.cost_attendees})</TableCell>
              </TableRow>
              <AdditionalRoomRow totals={totals} />
              <TableRow>
                <TableCell>{/* Date Column */}</TableCell>
                <TableCell>
                  {formattedDate(transaction.event_start)} -{' '}
                  {formattedDate(transaction.event_end)} ({days} {dayLabel})
                </TableCell>
                <TableCell>{/* Credit Column */}</TableCell>
              </TableRow>
            </>
          )}
        </Details>
      )}
    />
  )
}

function AdditionalRoomRow(props: {totals: EventCreditTransactionTotals}) {
  const {totals} = props

  // Only show row if additional rooms were added
  if (!totals.num_additional_rooms) {
    return null
  }

  const additionalRoomsLabel =
    totals.num_additional_rooms > 1 ? 'Additional Rooms' : 'Additional Room'

  return (
    <TableRow>
      <TableCell>{/* Date Column */}</TableCell>
      <TableCell>
        {totals.num_additional_rooms} {additionalRoomsLabel}
      </TableCell>
      <TableCell>({totals.cost_additional_rooms})</TableCell>
    </TableRow>
  )
}

function useFetchDetails(transaction: EventCreditTransaction) {
  const url = api(`/events/${transaction.event_slug}/credit_transactions`)

  return useCallback(
    () => teamMemberClient.get<EventCreditTransactionTotals>(url),
    [url],
  )
}
