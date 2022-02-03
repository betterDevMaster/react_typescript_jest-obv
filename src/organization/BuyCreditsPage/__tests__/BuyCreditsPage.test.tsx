import React from 'react'
import axios from 'axios'
import {ajax} from 'rxjs/ajax'
import {act} from 'react-dom/test-utils'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {PURCHASE_CREDITS} from 'organization/PermissionsProvider'
import {fakePlan} from 'obvio/Billing/__utils__/factory'
import {TeamMember} from 'auth/user'
import {hideConsoleErrors} from 'setupTests'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock
const mockAjax = ajax.get as jest.Mock

hideConsoleErrors()

beforeEach(() => {
  jest.clearAllMocks()
})

jest.mock('rxjs/ajax')

it('should purchase credits by team member with purchase permission', async () => {
  const owner = fakeTeamMember({
    has_active_subscription: true,
    plan: fakePlan({name: 'enterprise'}),
    credits: 0,
  })
  const {paymentMethod} = signInToOrganization({
    authUser: fakeTeamMember(),
    owner,
    userPermissions: [PURCHASE_CREDITS],
  })

  const {findByText, findByLabelText, findAllByLabelText} = render(<App />)

  user.click(await findByLabelText('home link'))

  user.click(await findByLabelText('purchase credit link'))

  const initialPrice = 20
  mockAjax.mockResolvedValueOnce({
    response: {
      price: initialPrice,
    },
  })

  expect(await findByText(`$${initialPrice}.00`)).toBeInTheDocument()

  const updatedPrice = 400
  mockAjax.mockResolvedValueOnce({
    response: {
      price: updatedPrice,
    },
  })

  const purchaseAmount = 200
  await act(async () => {
    user.click(await findByText(`${purchaseAmount}`))
  })

  expect(await findByText(`$${updatedPrice}.00`)).toBeInTheDocument()

  const withCredits: TeamMember = {
    ...owner,
    credits: purchaseAmount,
  }

  mockPost.mockResolvedValueOnce({data: withCredits})

  mockAjax.mockResolvedValueOnce({
    response: {
      price: initialPrice,
    },
  })

  user.click(await findByLabelText('buy credits'))
  user.click(await findByLabelText('confirm purchase'))

  expect(
    await findByText(/credits successfully purchased/i),
  ).toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch('/purchase_credits')
  expect(data.payment_method_id).toBe(paymentMethod.id)

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // events

  user.click(await findByText(/close/i))

  user.click(await findByLabelText('account menu'))

  expect(
    (await findAllByLabelText('organization credit balance'))[0].textContent,
  ).toBe(`${purchaseAmount}`)
})
