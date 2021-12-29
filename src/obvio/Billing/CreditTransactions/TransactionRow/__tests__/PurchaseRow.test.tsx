import user from '@testing-library/user-event'
import axios from 'axios'
import {fakePaginate} from 'lib/__utils__/pagination-factory'
import {fakePurchaseCreditTransaction} from 'obvio/Billing/CreditTransactions/__utils__/factory'
import {PurchaseCreditTransactionInfo} from 'obvio/Billing/CreditTransactions/TransactionRow/PurchaseRow'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'

const mockGet = axios.get as jest.Mock

it('should show purchase transaction info', async () => {
  const {findByText, findByLabelText} = await goToBillingSettings()

  mockGet.mockResolvedValueOnce({
    data: fakePaginate({
      data: [fakePurchaseCreditTransaction()],
      total: 21, // has next page
      per_page: 20,
    }),
  })

  user.click(await findByText(/view transactions/i))

  const info: PurchaseCreditTransactionInfo = {
    amount: 200,
    details: {
      price: 1000,
      actor: {
        email: 'someuser@obv.io',
        first_name: 'John',
        last_name: 'Smith',
      },
    },
  }
  mockGet.mockResolvedValueOnce({
    data: info,
  })

  user.click(await findByLabelText('view purchase details'))

  // Shows price
  expect(await findByText(new RegExp(`1,000.00`, 'i'))).toBeInTheDocument()
})
