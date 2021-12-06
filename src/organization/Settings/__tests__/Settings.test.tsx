import React from 'react'
import axios from 'axios'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update an organization', async () => {
  const authUser = fakeTeamMember()
  const {organization} = signInToOrganization({
    authUser,
    owner: authUser,
  })

  const {findByText, findByLabelText} = render(<App />)

  user.click(await findByText(organization.name))

  const newName = faker.company.companyName()

  mockPut.mockImplementationOnce(() =>
    Promise.resolve({data: fakeOrganization({name: newName})}),
  )

  user.type(await findByLabelText('organization name'), newName)
  user.click(await findByLabelText('update'))

  // Updated organization
  expect(await findByText(newName)).toBeInTheDocument()

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/organizations/${organization.id}`)
  expect(data.name).toBe(newName)
})

it('should only show settings for owners', async () => {
  const event = fakeEvent()
  const {organization} = signInToOrganization({
    authUser: fakeTeamMember(),
    owner: fakeTeamMember(), // another User
    events: [event],
  })

  const {findByText} = render(<App />)

  user.click(await findByText(organization.name))
  // Is showing events page instead of settings
  expect(await findByText(event.name)).toBeInTheDocument()
})
