import mockAxios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import {fakePlan} from 'obvio/Billing/__utils__/factory'

const mockGet = mockAxios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show unpaid transactions overlay', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: true,
    has_payment_method: false,
    has_unpaid_transactions: true, // has unpaid transactions
    plan: null,
  })

  const {findByText} = await signInToObvio({
    beforeRender: () => {
      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    authUser: teamMember,
  })

  expect(await findByText(/unpaid credit transactions/i)).toBeInTheDocument()
})

it('should show credit card required overlay', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: true,
    has_payment_method: false, // no card
    has_unpaid_transactions: false,
    plan: fakePlan(), // but has plan
  })

  const {findByText} = await signInToObvio({
    beforeRender: () => {
      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    authUser: teamMember,
  })

  expect(await findByText(/credit card required/i)).toBeInTheDocument()
})
