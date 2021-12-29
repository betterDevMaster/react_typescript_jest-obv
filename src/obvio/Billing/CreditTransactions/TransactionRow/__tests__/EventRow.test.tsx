import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakePaginate} from 'lib/__utils__/pagination-factory'
import {fakeEventCreditTransaction} from 'obvio/Billing/CreditTransactions/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'
import {EventCreditTransactionTotals} from 'obvio/Billing/CreditTransactions/TransactionRow/EventRow'

const mockGet = axios.get as jest.Mock

it('should show purchase event totals', async () => {
  const {findByText, findByLabelText} = await goToBillingSettings()

  mockGet.mockResolvedValueOnce({
    data: fakePaginate({
      data: [fakeEventCreditTransaction()],
      total: 21, // has next page
      per_page: 20,
    }),
  })

  user.click(await findByText(/view transactions/i))

  const num_attendees = 3488
  const totals: EventCreditTransactionTotals = {
    num_attendees,
    cost_attendees: 300,
    num_additional_rooms: 5,
    cost_additional_rooms: 500,
  }
  mockGet.mockResolvedValueOnce({
    data: totals,
  })

  user.click(await findByLabelText('view event totals'))

  expect(await findByText(new RegExp(`${num_attendees}`))).toBeInTheDocument()
})
