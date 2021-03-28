import React from 'react'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {fakeRole} from 'organization/Team/Roles/__utils__/factory'
import user from '@testing-library/user-event'
import {render} from '__utils__/render'
import App from 'App'
import {ALL_PERMISSIONS} from 'organization/__utils__/factory'
import faker from 'faker'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock
const mockPut = axios.put as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('toggles permissions', async () => {
  const targetIndex = faker.random.number({
    min: 0,
    max: ALL_PERMISSIONS.length - 1,
  })

  const permission = ALL_PERMISSIONS[targetIndex]

  const authUser = fakeTeamMember()
  signInToOrganization({
    authUser,
    owner: authUser,
    userPermissions: [UPDATE_TEAM],
  })
  const {findByText, findAllByLabelText} = render(<App />)

  const role = fakeRole({permissions: [permission]}) // start with permission

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [role]}))

  user.click(await findByText(/team/i))
  user.click(await findByText(/roles/i))

  // starts checked
  expect(
    ((await findAllByLabelText('toggle permission'))[
      targetIndex
    ] as HTMLInputElement).checked,
  ).toBe(true)

  const withoutPermission = {...role, permissions: []}
  mockDelete.mockImplementationOnce(() =>
    Promise.resolve({data: withoutPermission}),
  )

  user.click((await findAllByLabelText('toggle permission'))[targetIndex])

  // is now unchecked
  expect(
    ((await findAllByLabelText('toggle permission'))[
      targetIndex
    ] as HTMLInputElement).checked,
  ).toBe(false)

  const withPermissionAdded = {...role, permissions: [permission]}
  mockPut.mockImplementationOnce(() =>
    Promise.resolve({data: withPermissionAdded}),
  )

  user.click((await findAllByLabelText('toggle permission'))[targetIndex])

  // is now checked again
  expect(
    ((await findAllByLabelText('toggle permission'))[
      targetIndex
    ] as HTMLInputElement).checked,
  ).toBe(true)

  // Check that we're updating the right permission
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete.mock.calls[0][0]).toMatch(permission)

  expect(mockPut).toHaveBeenCalledTimes(1)
  expect(mockPut.mock.calls[0][1]['permission']).toBe(permission)
})

it('should check permissions', async () => {
  const targetIndex = faker.random.number({
    min: 0,
    max: ALL_PERMISSIONS.length - 1,
  })

  const permission = ALL_PERMISSIONS[targetIndex]

  const authUser = fakeTeamMember()
  signInToOrganization({
    authUser,
    owner: authUser,
  })

  const {findByText, findAllByLabelText} = render(<App />)

  const role = fakeRole({permissions: [permission]}) // start with permission

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [role]}))

  user.click(await findByText(/team/i))
  user.click(await findByText(/roles/i))

  // starts checked
  expect(
    ((await findAllByLabelText('toggle permission'))[
      targetIndex
    ] as HTMLInputElement).checked,
  ).toBe(true)

  const withoutPermission = {...role, permissions: []}
  mockDelete.mockImplementationOnce(() =>
    Promise.resolve({data: withoutPermission}),
  )

  user.click((await findAllByLabelText('toggle permission'))[targetIndex])

  // is still checked because user did not have required permissions
  expect(
    ((await findAllByLabelText('toggle permission'))[
      targetIndex
    ] as HTMLInputElement).checked,
  ).toBe(true)
})
