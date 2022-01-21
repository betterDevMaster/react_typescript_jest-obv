import React from 'react'
import axios from 'axios'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {wait} from '@testing-library/react'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {PURCHASE_CREDITS} from 'organization/PermissionsProvider'

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

  user.click(await findByLabelText('home link'))

  const newName = faker.company.companyName()

  const withNewName = {
    ...organization,
    name: newName,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: withNewName}))

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

it('should show organization credits for owner', async () => {
  const authUser = fakeTeamMember()
  signInToOrganization({
    authUser,
    owner: authUser,
  })

  const {findByText, findByLabelText} = render(<App />)

  user.click(await findByLabelText('home link'))

  expect(await findByText('Settings')).toBeInTheDocument()

  expect(await findByText('Credits')).toBeInTheDocument()

  expect(
    await findByLabelText('organization credit balance'),
  ).toBeInTheDocument()
})

it('should show organization credits for user with purchase credits permission', async () => {
  signInToOrganization({
    authUser: fakeTeamMember(),
    owner: fakeTeamMember(),
    userPermissions: [PURCHASE_CREDITS],
  })

  const {findByText, findByLabelText, findAllByLabelText} = render(<App />)

  user.click(await findByLabelText('home link'))

  expect(await findByText('Settings')).toBeInTheDocument()

  expect(await findByText('Credits')).toBeInTheDocument()

  expect(
    (await findAllByLabelText('organization credit balance')).length,
  ).toBeGreaterThan(0)
})

it('should not show settings for user without purchase credits permission', async () => {
  const event = fakeEvent()
  const {organization} = signInToOrganization({
    authUser: fakeTeamMember(),
    owner: fakeTeamMember(),
    events: [event],
  })

  const {findByText} = render(<App />)

  user.click(await findByText(organization.name))
  // Is showing events page instead of settings
  expect(await findByText(event.name)).toBeInTheDocument()
})
