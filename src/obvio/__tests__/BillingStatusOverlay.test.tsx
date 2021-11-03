import mockAxios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'

const mockGet = mockAxios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show invalid subscription overlay', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: false, // no subscription
    has_payment_method: false,
    plan: null,
  })

  const {findByText} = await signInToObvio({
    beforeRender: () => {
      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    user: teamMember,
  })

  expect(await findByText(/inactive subscription/i)).toBeInTheDocument()
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
    user: teamMember,
  })

  expect(await findByText(/unpaid credit transactions/i)).toBeInTheDocument()
})
