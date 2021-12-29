import Layout from 'obvio/user/Layout'
import Title from 'lib/ui/typography/Title'
import Divider from 'lib/ui/layout/Divider'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Page from 'lib/ui/layout/Page'
import React, {useCallback, useRef, useState} from 'react'
import {obvioRoutes} from 'obvio/Routes'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import TableFooter from '@material-ui/core/TableFooter'
import {api} from 'lib/url'
import {teamMemberClient} from 'obvio/obvio-client'
import {PaginatedCollection} from 'lib/ui/api-client'
import {useAsync} from 'lib/async'
import TablePagination from '@material-ui/core/TablePagination'
import PaginationActions from 'lib/ui/table/PaginationActions'
import TransactionRow from 'obvio/Billing/CreditTransactions/TransactionRow'

type CreditTransactionBase = {
  id: number
  total: number
}

export type EventCreditTransaction = CreditTransactionBase & {
  transaction_type: 'event'
  event_name: string
  event_slug: string
}

export type PurchaseCreditTransaction = CreditTransactionBase & {
  transaction_type: 'purchase'
}

export type CreditTransaction =
  | EventCreditTransaction
  | PurchaseCreditTransaction

export default function CreditTransactions() {
  useBreadcrumbs([
    {
      title: 'Billing',
      url: obvioRoutes.billing.root,
    },
    {
      title: 'Credit Transactions',
      url: `${obvioRoutes.billing.credit_transactions}`,
    },
  ])

  return (
    <Layout>
      <Page>
        <Title>Credit Transactions</Title>
        <Divider />
        <Content />
      </Page>
    </Layout>
  )
}

function Content() {
  const [page, setPage] = useState(0)

  // MUI is 0 index based pages, and Laravel starts at 1, so we
  // need to increment manually>
  const {transactions, result} = useTransaction(page + 1)

  const handlePageChange = (event: any, page: number) => {
    setPage(page)
  }

  useBreadcrumbs([
    {
      title: 'Billing',
      url: obvioRoutes.billing.root,
    },
    {
      title: 'Credit Transactions',
      url: `${obvioRoutes.billing.credit_transactions}`,
    },
  ])

  const tableContainerEl = useRef<HTMLElement>(null)

  if (!result) {
    return <p>loading...</p>
  }

  const hasTransactions = transactions.length > 0

  if (!hasTransactions) {
    return <p>No credits transactions have been recorded.</p>
  }

  return (
    <TableContainer component={Paper} ref={tableContainerEl}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TransactionRow transaction={transaction} key={transaction.id} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={4}
              count={result.total}
              rowsPerPageOptions={[]} //  Hide selector
              rowsPerPage={result.per_page}
              page={result.current_page - 1} // MUI is 0 index based
              SelectProps={{
                inputProps: {'aria-label': 'select rows per page'},
                native: true,
              }}
              onChangePage={handlePageChange}
              ActionsComponent={PaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

function useTransaction(page: number) {
  const url = listUrl(String(page))

  const request = useCallback(
    () => teamMemberClient.get<PaginatedCollection<CreditTransaction>>(url),
    [url],
  )

  const {data: result} = useAsync(request)

  return {
    transactions: result?.data || [],
    result,
  }
}

function listUrl(page: string) {
  const baseUrl = api(`/credit_transactions`)
  const params = new URLSearchParams({
    page,
  })

  const query = params.toString()

  return `${baseUrl}?${query}`
}
