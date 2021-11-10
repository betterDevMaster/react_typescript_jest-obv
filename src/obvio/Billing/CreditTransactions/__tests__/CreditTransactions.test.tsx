import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakePaymentMethod} from 'obvio/Billing/__utils__/factory'
import {fakePaginate} from 'lib/__utils__/pagination-factory'
import {
  fakeAdditionalRoomsTransaction,
  fakeAttendeesTransaction,
} from 'obvio/Billing/CreditTransactions/__utils__/factory'

const mockGet = axios.get as jest.Mock

it('should show transactions', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: true,
    has_unpaid_transactions: false,
    plan: 'enterprise',
    is_subscribed: true,
    credits: 0, // start with 0 credits
  })

  const {findByText, findByLabelText} = await signInToObvio({
    beforeRender: () => {
      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    user: teamMember,
  })

  user.click(await findByLabelText('account menu'))

  mockGet.mockResolvedValueOnce({data: fakePaymentMethod()})

  user.click(await findByLabelText('billing settings'))

  const numAttendees = 5
  const durationDays = 2
  const pageOne = [
    fakeAttendeesTransaction({
      details: {
        num_attendees: numAttendees,
        duration_days: durationDays,
      },
    }),
  ]

  mockGet.mockResolvedValueOnce({
    data: fakePaginate({
      data: pageOne,
      total: 21, // has next page
      per_page: 20,
    }),
  })

  user.click(await findByText(/view transactions/i))

  expect(
    await findByText(`${numAttendees} Attendees for ${durationDays} Days`),
  ).toBeInTheDocument()

  // Go next page

  const numRooms = 10
  const pageTwo = [
    fakeAdditionalRoomsTransaction({
      details: {
        num_rooms: numRooms,
      },
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

  expect(await findByText(`${numRooms} Rooms`)).toBeInTheDocument()
})
