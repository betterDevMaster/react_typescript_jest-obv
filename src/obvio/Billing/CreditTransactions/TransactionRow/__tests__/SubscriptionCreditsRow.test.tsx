import user from '@testing-library/user-event'
import axios from 'axios'
import {fakePaginate} from 'lib/__utils__/pagination-factory'
import {fakeSubscriptionCreditTransaction} from 'obvio/Billing/CreditTransactions/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'
import {SubscriptionCreditsTransactionInfo} from 'obvio/Billing/CreditTransactions/TransactionRow/SubscriptionCreditsRow'
import {getPlan} from 'obvio/Billing/plans'

const mockGet = axios.get as jest.Mock

it('should show subscription transaction info', async () => {
  const {findByText, findByLabelText} = await goToBillingSettings()

  const plan = 'professional'
  const planInfo = getPlan(plan)

  mockGet.mockResolvedValueOnce({
    data: fakePaginate({
      data: [fakeSubscriptionCreditTransaction({plan})],
      total: 21, // has next page
      per_page: 20,
    }),
  })

  user.click(await findByText(/view transactions/i))

  const amountPaid = 997

  const info: SubscriptionCreditsTransactionInfo = {
    details: {
      amount_paid: amountPaid,
    },
  }
  mockGet.mockResolvedValueOnce({
    data: info,
  })

  user.click(await findByLabelText('view subscription credits details'))

  // Shows price
  expect(
    await findByText(new RegExp(`${planInfo.label} annual subscription`, 'i')),
  ).toBeInTheDocument()
})
