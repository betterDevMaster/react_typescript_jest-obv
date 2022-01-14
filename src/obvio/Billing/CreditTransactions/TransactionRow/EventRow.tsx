import TableCell from '@material-ui/core/TableCell'
import {getNumDays} from 'lib/date-time'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import {EventCreditTransaction} from 'obvio/Billing/CreditTransactions'
import {
  ClickableRow,
  DetailRow,
  formattedDate,
  LastTransactionDateCell,
  LoadingDetailsRow,
} from 'obvio/Billing/CreditTransactions/TransactionRow'
import {teamMemberClient} from 'obvio/obvio-client'
import React, {useCallback, useEffect, useState} from 'react'

export type EventCreditTransactionTotals = {
  num_attendees: number
  cost_attendees: number
  num_additional_rooms: number
  cost_additional_rooms: number
}

export default function EventRow(props: {transaction: EventCreditTransaction}) {
  const {transaction} = props
  const {flag: expanded, toggle: toggleExpand} = useToggle()

  return (
    <>
      <ClickableRow hover aria-label="view event totals" onClick={toggleExpand}>
        <LastTransactionDateCell transaction={transaction} />
        <TableCell>{transaction.event_name}</TableCell>
        <TableCell>({transaction.total})</TableCell>
      </ClickableRow>
      <Details transaction={transaction} showing={expanded} />
    </>
  )
}

function Details(props: {
  showing: boolean
  transaction: EventCreditTransaction
}) {
  const {showing, transaction} = props
  const fetch = useFetchDetails(transaction)

  const [totals, setTotals] = useState<null | EventCreditTransactionTotals>(
    null,
  )

  useEffect(() => {
    if (!showing) {
      setTotals(null)
      return
    }

    fetch().then(setTotals)
  }, [showing, fetch])

  if (!showing) {
    return null
  }

  if (!totals) {
    return <LoadingDetailsRow />
  }

  const days = getNumDays(transaction.event_start, transaction.event_end)
  const dayLabel = days > 1 ? 'Days' : 'Day'

  const attendeeLabel = totals.num_attendees > 1 ? 'Attendees' : 'Attendee'

  return (
    <>
      <DetailRow>
        <TableCell>{/* Date Column */}</TableCell>
        <TableCell>
          {totals.num_attendees} {attendeeLabel}
        </TableCell>
        <TableCell>({totals.cost_attendees})</TableCell>
      </DetailRow>
      <AdditionalRoomRow totals={totals} />
      <DetailRow>
        <TableCell>{/* Date Column */}</TableCell>
        <TableCell>
          {formattedDate(transaction.event_start)} -{' '}
          {formattedDate(transaction.event_end)} ({days} {dayLabel})
        </TableCell>
        <TableCell>{/* Credit Column */}</TableCell>
      </DetailRow>
    </>
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
    <DetailRow>
      <TableCell>{/* Date Column */}</TableCell>
      <TableCell>
        {totals.num_additional_rooms} {additionalRoomsLabel}
      </TableCell>
      <TableCell>({totals.cost_additional_rooms})</TableCell>
    </DetailRow>
  )
}

function useFetchDetails(transaction: EventCreditTransaction) {
  const url = api(`/events/${transaction.event_slug}/credit_transactions`)

  return useCallback(
    () => teamMemberClient.get<EventCreditTransactionTotals>(url),
    [url],
  )
}
