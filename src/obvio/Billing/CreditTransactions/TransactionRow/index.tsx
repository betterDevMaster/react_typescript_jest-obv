import {CreditTransaction} from 'obvio/Billing/CreditTransactions'
import styled from 'styled-components'
import EventRow from 'obvio/Billing/CreditTransactions/TransactionRow/EventRow'
import PurchaseRow from 'obvio/Billing/CreditTransactions/TransactionRow/PurchaseRow'
import React, {useCallback, useEffect, useState} from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import CircularProgress from '@material-ui/core/CircularProgress'
import {localTime} from 'lib/date-time'
import SubscriptionCreditsRow from 'obvio/Billing/CreditTransactions/TransactionRow/SubscriptionCreditsRow'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import {teamMemberClient} from 'obvio/obvio-client'

export default function TransactionRow(props: {
  transaction: CreditTransaction
}) {
  const {transaction} = props

  if (transaction.transaction_group === 'event_deduction') {
    return <EventRow transaction={transaction} />
  }

  if (transaction.type === 'subscription_credits') {
    return <SubscriptionCreditsRow transaction={transaction} />
  }

  return <PurchaseRow transaction={transaction} />
}

export function Body(props: {
  'aria-label'?: string
  transaction: CreditTransaction
  title: string
  details: (showing: boolean) => JSX.Element
}) {
  const {transaction, details, title} = props
  const {flag: expanded, toggle: toggleExpand} = useToggle()

  return (
    <>
      <ClickableRow
        hover
        onClick={toggleExpand}
        aria-label={props['aria-label']}
      >
        <LastTransactionDateCell transaction={transaction} />
        <TableCell>{title}</TableCell>
        <TableCell>{transaction.total}</TableCell>
      </ClickableRow>
      {details(expanded)}
    </>
  )
}

export function creditLabel(numCredits: number) {
  return numCredits > 1 ? 'credits' : 'credit'
}

function LastTransactionDateCell(props: {transaction: CreditTransaction}) {
  return (
    <DateCell>{formattedDate(props.transaction.last_transaction)}</DateCell>
  )
}

export function formattedDate(date: string) {
  return localTime(date, 'MMMM D, YYYY')
}

export function Details<T>(props: {
  showing: boolean
  fetch: () => Promise<T>
  children: (details: T) => JSX.Element | JSX.Element[]
}) {
  const {showing, children, fetch} = props
  const [details, setDetails] = useState<T | null>(null)

  // Auto-fetch on show
  useEffect(() => {
    if (!showing) {
      setDetails(null)
      return
    }

    fetch().then(setDetails)
  }, [showing, fetch])

  if (!showing) {
    return null
  }

  if (!details) {
    return <LoadingDetailsRow />
  }

  return <>{children(details)}</>
}

function LoadingDetailsRow() {
  return (
    <TableRow>
      <TableCell>
        <CircularProgress
          size={18}
          thickness={6}
          value={100}
          variant="indeterminate"
          color="primary"
        />
      </TableCell>
      <TableCell>{/*Detail Column*/}</TableCell>
      <TableCell>{/*Credits Column*/}</TableCell>
    </TableRow>
  )
}

export function useFetchTransaction<T>(transaction: {id: number}) {
  const url = api(`/credit_transactions/${transaction.id}`)

  return useCallback(() => teamMemberClient.get<T>(url), [url])
}

const DateCell = styled(TableCell)`
  width: 0%;
  white-space: nowrap;
`

export const ClickableRow = styled(TableRow)`
  cursor: pointer;
`
