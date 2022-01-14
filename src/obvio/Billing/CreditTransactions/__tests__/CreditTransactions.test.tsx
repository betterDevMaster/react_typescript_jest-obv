import user from '@testing-library/user-event'
import axios from 'axios'
import {fakePaginate} from 'lib/__utils__/pagination-factory'
import {
  fakeEventCreditTransaction,
  fakePurchaseCreditTransaction,
} from 'obvio/Billing/CreditTransactions/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'

const mockGet = axios.get as jest.Mock

it('should show transactions', async () => {
  const {findByText, findByLabelText} = await goToBillingSettings()

  const eventTransaction = fakeEventCreditTransaction()
  const pageOne = [eventTransaction]

  mockGet.mockResolvedValueOnce({
    data: fakePaginate({
      data: pageOne,
      total: 21, // has next page
      per_page: 20,
    }),
  })

  user.click(await findByText(/view transactions/i))

  expect(
    await findByText(new RegExp(`${eventTransaction.event_name}`, 'i')),
  ).toBeInTheDocument()

  // Go next page

  const purchaseTotal = 100
  const pageTwo = [
    fakePurchaseCreditTransaction({
      total: purchaseTotal,
    }),
  ]

  mockGet.mockResolvedValueOnce({
    data: fakePaginate({
      data: pageTwo,
      total: 10,
      per_page: 20,
    }),
  })

  user.click(await findByLabelText('go to next page'))

  expect(
    await findByText(new RegExp(`credit purchase`, 'i')),
  ).toBeInTheDocument()
})
