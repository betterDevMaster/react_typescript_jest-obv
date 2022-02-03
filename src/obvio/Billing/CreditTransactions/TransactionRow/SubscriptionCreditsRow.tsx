import {SubscriptionCreditsTransaction} from 'obvio/Billing/CreditTransactions'
import React from 'react'
import {
  Details,
  Body,
  useFetchTransaction,
} from 'obvio/Billing/CreditTransactions/TransactionRow'
import {getPlan} from 'obvio/Billing/plans'
import {useObvioUser} from 'obvio/auth'
import {formatPrice} from 'lib/currency'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

export type SubscriptionCreditsTransactionInfo = {
  details: {
    amount_paid: number
  }
}

export default function SubscriptionCreditsRow(props: {
  transaction: SubscriptionCreditsTransaction
}) {
  const {transaction} = props

  const planInfo = getPlan(props.transaction.plan)
  const user = useObvioUser()

  const fetch = useFetchTransaction<SubscriptionCreditsTransactionInfo>(
    transaction,
  )

  return (
    <Body
      aria-label="view subscription credits details"
      transaction={transaction}
      title="Subscription Purchase"
      details={(showing) => (
        <Details showing={showing} fetch={fetch}>
          {({details}) => (
            <TableRow>
              <TableCell>{/* Date Column */}</TableCell>
              <TableCell>
                {planInfo.label} Annual subscription of $
                {formatPrice(details.amount_paid)} by {user.first_name}{' '}
                {user.last_name}
              </TableCell>
              <TableCell>{/* Credits Column */}</TableCell>
            </TableRow>
          )}
        </Details>
      )}
    />
  )
}
