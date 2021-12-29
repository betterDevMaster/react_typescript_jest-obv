import TableCell from '@material-ui/core/TableCell'
import {PurchaseCreditTransaction} from 'obvio/Billing/CreditTransactions'
import React, {useCallback, useEffect, useState} from 'react'
import {api} from 'lib/url'
import {useToggle} from 'lib/toggle'
import {teamMemberClient} from 'obvio/obvio-client'
import {
  ClickableRow,
  creditLabel,
  DetailRow,
  LastTransactionDateCell,
  LoadingDetailsRow,
} from 'obvio/Billing/CreditTransactions/TransactionRow'
import {formatPrice} from 'lib/currency'

export type PurchaseCreditTransactionInfo = {
  amount: number
  details: {
    price: number
    actor: {
      email: string
      first_name: string
      last_name: string
    }
  }
}

export default function PurchaseRow(props: {
  transaction: PurchaseCreditTransaction
}) {
  const {transaction} = props
  const {flag: expanded, toggle: toggleExpand} = useToggle()

  return (
    <>
      <ClickableRow
        hover
        onClick={toggleExpand}
        aria-label="view purchase details"
      >
        <LastTransactionDateCell transaction={transaction} />
        <TableCell>Credit Purchase</TableCell>
        <TableCell>{transaction.total}</TableCell>
      </ClickableRow>
      <Details showing={expanded} transaction={transaction} />
    </>
  )
}

function Details(props: {
  showing: boolean
  transaction: PurchaseCreditTransaction
}) {
  const {showing, transaction} = props

  const fetch = useFetchDetails(transaction)

  const [info, setInfo] = useState<null | PurchaseCreditTransactionInfo>(null)

  useEffect(() => {
    if (!showing) {
      setInfo(null)
      return
    }

    fetch().then(setInfo)
  }, [showing, fetch])

  if (!showing) {
    return null
  }

  if (!info) {
    return <LoadingDetailsRow />
  }

  return (
    <DetailRow>
      <TableCell>{/* Date Column */}</TableCell>
      <TableCell>
        {transaction.total} {creditLabel(transaction.total)} purchased for $
        {formatPrice(info.details.price)} by {info.details.actor.first_name}{' '}
        {info.details.actor.last_name}
      </TableCell>
      <TableCell>{/* Credits Column */}</TableCell>
    </DetailRow>
  )
}

function useFetchDetails(transaction: PurchaseCreditTransaction) {
  const url = api(`/credit_transactions/${transaction.id}`)

  return useCallback(
    () => teamMemberClient.get<PurchaseCreditTransactionInfo>(url),
    [url],
  )
}
