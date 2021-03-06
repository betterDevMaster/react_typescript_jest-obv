import axios from 'axios'
import {fakeRole} from 'organization/Team/Roles/__utils__/factory'
import user from '@testing-library/user-event'
import {ALL_PERMISSIONS} from 'organization/__utils__/factory'
import faker from 'faker'
import {goToTeams} from 'organization/Team/__utils__/go-to-teams-page'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

const mockPut = axios.put as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('toggles permissions', async () => {
  const targetIndex = faker.random.number({
    min: 0,
    max: ALL_PERMISSIONS.length - 1,
  })

  const permission = ALL_PERMISSIONS[targetIndex]

  const role = fakeRole({permissions: [permission]}) // start with permission

  const someUser = fakeTeamMember()

  const {findByText, findAllByLabelText} = await goToTeams({
    roles: [role],
    owner: someUser, // is is owner
    authUser: someUser,
  })

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

it('should disable purchase credit permissions', async () => {
  const role = fakeRole()

  // We just KNOW that the purchase credits checkbox is the 8th checkbox, ideally
  // we update aria-labels to include role+permission toggle, but this should
  // be enough for now.
  const purchaseCreditsIndex = 7

  const {findByText, findAllByLabelText} = await goToTeams({
    roles: [role],
  })

  user.click(await findByText(/roles/i))

  // starts checked
  expect(
    (await findAllByLabelText('toggle permission'))[purchaseCreditsIndex],
  ).toBeDisabled()
})
