import React from 'react'
import axios from 'axios'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {act, fireEvent, wait} from '@testing-library/react'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'
import {fakeRole} from 'organization/Team/Roles/__utils__/factory'
import {TeamMember} from 'organization/Team'

const mockGet = axios.get as jest.Mock
const mockPut = axios.put as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('should update a user role', async () => {
  const authUser = fakeTeamMember()
  signInToOrganization({
    authUser,
    owner: authUser,
    userPermissions: [UPDATE_TEAM],
  })

  const teamMembers = Array.from(
    {
      length: faker.random.number({min: 1, max: 5}),
    },
    fakeTeamMember,
  )

  const {findByText, findAllByLabelText, findByLabelText} = render(<App />)

  expect(await findByText(/team/i)).toBeInTheDocument()

  const roles = [fakeRole(), fakeRole()]

  mockGet.mockImplementationOnce(() => Promise.resolve({data: teamMembers})) // team members
  mockGet.mockImplementationOnce(() => Promise.resolve({data: roles})) // team members

  user.click(await findByText(/team/i))

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
