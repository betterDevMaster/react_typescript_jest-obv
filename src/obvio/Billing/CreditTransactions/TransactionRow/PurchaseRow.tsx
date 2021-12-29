import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import {PurchaseCreditTransaction} from 'obvio/Billing/CreditTransactions'
import React, {useCallback, useEffect, useState} from 'react'
import {api} from 'lib/url'
import {useToggle} from 'lib/toggle'
import {teamMemberClient} from 'obvio/obvio-client'
import {
  ClickableCell,
  creditLabel,
  DetailRow,
  LoadingDetailsRow,
} from 'obvio/Billing/CreditTransactions/TransactionRow'

export type PurchaseCreditTransactionInfo = {
  amount: number
  details: {
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
      <TableRow hover>
        <ClickableCell
          onClick={toggleExpand}
          aria-label="view purchase details"
        >
          Purchased {transaction.total} {creditLabel(transaction.total)}
        </ClickableCell>
      </TableRow>
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
      <TableCell>
        By {info.details.actor.first_name} {info.details.actor.last_name} (
        {info.details.actor.email})
      </TableCell>
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
