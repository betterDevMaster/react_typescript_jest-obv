import axios from 'axios'
import faker from 'faker'
import user from '@testing-library/user-event'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fireEvent, wait} from '@testing-library/react'
import {fakeRole} from 'organization/Team/Roles/__utils__/factory'
import {TeamMember} from 'auth/user'
import {goToTeams} from 'organization/Team/__utils__/go-to-teams-page'
import {PURCHASE_CREDITS} from 'organization/PermissionsProvider'

const mockPut = axios.put as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('should update a user role', async () => {
  const teamMembers = Array.from(
    {
      length: faker.random.number({min: 1, max: 5}),
    },
    fakeTeamMember,
  )

  const roles = [fakeRole(), fakeRole()]

  const {findAllByLabelText, findByLabelText} = await goToTeams({
    teamMembers,
    roles,
  })

  expect((await findAllByLabelText('team member')).length).toBe(
    teamMembers.length,
  )

  const targetIndex = faker.random.number({min: 0, max: teamMembers.length - 1})
  const target = teamMembers[targetIndex]

  /**
   * Assign first role
   *
   */

  fireEvent.mouseDown((await findAllByLabelText('pick role'))[targetIndex])

  const assigned: TeamMember = {...target, role: roles[0]}
  mockPut.mockImplementationOnce(() => Promise.resolve({data: assigned}))

  user.click(await findByLabelText(`pick ${roles[0].name}`))

  await wait(() => {
    expect(mockPut).toBeCalledTimes(1)
  })

  expect(
    ((await findAllByLabelText('pick role'))[targetIndex] as HTMLDivElement)
      .textContent,
  ).toBe(roles[0].name)

  /**
   * Update to second role
   */

  fireEvent.mouseDown((await findAllByLabelText('pick role'))[targetIndex])

  const updated: TeamMember = {...target, role: roles[1]}
  mockPut.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText(`pick ${roles[1].name}`))

  await wait(() => {
    expect(mockPut).toBeCalledTimes(2)
  })

  expect(
    ((await findAllByLabelText('pick role'))[targetIndex] as HTMLDivElement)
      .textContent,
  ).toBe(roles[1].name)

  /**
   * Remove
   */

  fireEvent.mouseDown((await findAllByLabelText('pick role'))[targetIndex])

  const removed: TeamMember = {...target, role: null}
  mockDelete.mockImplementationOnce(() => Promise.resolve({data: removed}))

  user.click(await findByLabelText('remove role'))

  await wait(() => {
    expect(mockDelete).toBeCalledTimes(1)
  })

  expect(
    ((await findAllByLabelText('pick role'))[targetIndex] as HTMLDivElement)
      .textContent,
  ).toBe('None')
})

it('should disable a protected role', async () => {
  const roles = [fakeRole({permissions: [PURCHASE_CREDITS]})]

  const {findByLabelText} = await goToTeams({
    teamMembers: [fakeTeamMember()],
    roles,
  })

  fireEvent.mouseDown(await findByLabelText('pick role'))

  expect(
    (await findByLabelText(`pick ${roles[0].name}`)).getAttribute(
      'aria-disabled',
    ),
  ).toBe('true')
})
