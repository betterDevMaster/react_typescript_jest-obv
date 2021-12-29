import {CreditTransaction} from 'obvio/Billing/CreditTransactions'
import styled from 'styled-components'
import EventRow from 'obvio/Billing/CreditTransactions/TransactionRow/EventRow'
import PurchaseRow from 'obvio/Billing/CreditTransactions/TransactionRow/PurchaseRow'
import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function TransactionRow(props: {
  transaction: CreditTransaction
}) {
  const {transaction} = props

  if (transaction.transaction_type === 'event') {
    return <EventRow transaction={transaction} />
  }

  return <PurchaseRow transaction={transaction} />
}

export const DetailRow = styled(TableRow)`
  td {
    padding-left: ${(props) => props.theme.spacing[10]};
  }
`

export const ClickableCell = styled(TableCell)`
  cursor: pointer;
`

export function LoadingDetailsRow() {
  return (
    <DetailRow>
      <TableCell>
        <CircularProgress
          size={18}
          thickness={6}
          value={100}
          variant="indeterminate"
          color="primary"
        />
      </TableCell>
    </DetailRow>
  )
}

export function creditLabel(numCredits: number) {
  return numCredits > 1 ? 'credits' : 'credit'
}
