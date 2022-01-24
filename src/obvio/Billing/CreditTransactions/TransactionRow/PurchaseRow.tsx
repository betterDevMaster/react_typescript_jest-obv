import TableCell from '@material-ui/core/TableCell'
import {PurchaseCreditTransaction} from 'obvio/Billing/CreditTransactions'
import React from 'react'
import {
  creditLabel,
  Details,
  Body,
  useFetchTransaction,
} from 'obvio/Billing/CreditTransactions/TransactionRow'
import {formatPrice} from 'lib/currency'
import TableRow from '@material-ui/core/TableRow'

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
  const fetch = useFetchTransaction<PurchaseCreditTransactionInfo>(transaction)

  return (
    <Body
      aria-label="view purchase details"
      transaction={transaction}
      title="Credit Purchase"
      details={(showing) => (
        <Details showing={showing} fetch={fetch}>
          {({details}) => (
            <TableRow>
              <TableCell>{/* Date Column */}</TableCell>
              <TableCell>
                {transaction.total} {creditLabel(transaction.total)} purchased
                for ${formatPrice(details.price)} by {details.actor.first_name}{' '}
                {details.actor.last_name}
              </TableCell>
              <TableCell>{/* Credits Column */}</TableCell>
            </TableRow>
          )}
        </Details>
      )}
    />
  )
}
