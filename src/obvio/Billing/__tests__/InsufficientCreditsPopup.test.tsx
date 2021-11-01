import React from 'react'
import axios from 'axios'
import {render} from '__utils__/render'
import App from 'App'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'
import {act} from 'react-dom/test-utils'

const mockUseResponse = axios.interceptors.response.use as jest.Mock

it('should show insufficient credits error', async () => {
  const authUser = fakeTeamMember()
  signInToOrganization({
    authUser,
    owner: authUser,
    userPermissions: [UPDATE_TEAM],
  })

  const {findByText} = render(<App />)

  const errorHandler = mockUseResponse.mock.calls[0][1]

  act(() => {
    errorHandler({
      response: {
        data: {type: 'insufficient_credits', credits_short: 300},
      },
    }).catch(() => {})
  })

  expect(await findByText(/not enough credits/i)).toBeInTheDocument()
})
