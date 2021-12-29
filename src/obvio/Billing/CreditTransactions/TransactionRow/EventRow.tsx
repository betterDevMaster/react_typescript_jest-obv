import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import {EventCreditTransaction} from 'obvio/Billing/CreditTransactions'
import {
  ClickableCell,
  creditLabel,
  DetailRow,
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
      <TableRow hover>
        <ClickableCell onClick={toggleExpand} aria-label="view event totals">
          Deducted total of {transaction.total} {creditLabel(transaction.total)}{' '}
          for {transaction.event_name} ({transaction.event_slug})
        </ClickableCell>
      </TableRow>
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

  const attendeeLabel = totals.num_attendees > 1 ? 'Attendees' : 'Attendee'
  const additionalRoomsLabel =
    totals.num_additional_rooms > 1 ? 'Additional Roooms' : 'Additional Room'

  return (
    <DetailRow>
      <TableCell>
        {totals.num_attendees} {attendeeLabel} ({totals.cost_attendees}{' '}
        {creditLabel(totals.cost_attendees)}), and {totals.num_additional_rooms}{' '}
        {additionalRoomsLabel} ({totals.cost_additional_rooms} credits)
      </TableCell>
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
