import faker from 'faker'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {Attendee} from 'Event/attendee'
import {formatDate, now} from 'lib/date-time'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'
import {fireEvent, wait} from '@testing-library/react'
import {CHECK_IN_ATTENDEES} from 'organization/PermissionsProvider'
import {fakePaginate} from 'lib/__utils__/pagination-factory'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock
const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show list of attendees', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeAttendee,
  )
  const {findByText} = await goToAttendeeManagement({attendees})

  for (const attendee of attendees) {
    expect(await findByText(attendee.email)).toBeInTheDocument()
  }
})

it('should complete tech check for an attendee', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () => fakeAttendee({tech_check_completed_at: null}),
  )
  const {findAllByLabelText, findByLabelText} = await goToAttendeeManagement({
    attendees,
    userPermissions: [CHECK_IN_ATTENDEES],
  })

  const targetIndex = faker.random.number({min: 0, max: attendees.length - 1})
  const target = attendees[targetIndex]
  const today = now()
  const updated: Attendee = {...target, tech_check_completed_at: today}

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  // Complete tech check
  user.click((await findAllByLabelText('toggle check in'))[targetIndex])

  // checked-in shows today's date
  expect(
    (await findByLabelText('date of completing tech check')).textContent,
  ).toBe(formatDate(today))
})

it('should reverse tech check', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () => fakeAttendee({tech_check_completed_at: now()}), // all completed tech check
  )
  const {findAllByLabelText} = await goToAttendeeManagement({
    attendees,
    userPermissions: [CHECK_IN_ATTENDEES],
  })

  const targetIndex = faker.random.number({min: 0, max: attendees.length - 1})
  const target = attendees[targetIndex]
  const updated: Attendee = {...target, tech_check_completed_at: null}

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: updated}))

  // reverse tech check
  user.click((await findAllByLabelText('toggle check in'))[targetIndex])

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  // checked-in shows today's date
  expect(
    (await findAllByLabelText('toggle check in'))[targetIndex].textContent,
  ).toBe('Check-In')
})

it('should render attendee groups', async () => {
  const groups = Array.from(
    {length: faker.random.number({min: 2, max: 3})},
    () => `${faker.random.word()}_${faker.random.word()}`,
  )

  const attendeePerGroup = groups.map((group) =>
    fakeAttendee({groups: {[group]: faker.random.word()}}),
  )

  const randomAttendees = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    () => {
      const attendeeGroups = groups.reduce((acc, i) => {
        const addGroup = faker.random.boolean()
        if (!addGroup) {
          return acc
        }

        acc[i] = faker.random.word()
        return acc
      }, {} as Record<string, string>)

      return fakeAttendee({
        groups: attendeeGroups,
      })
    },
  )

  const attendees = [...attendeePerGroup, ...randomAttendees]

  const {findAllByLabelText, findByText} = await goToAttendeeManagement({
    attendees,
  })

  expect((await findAllByLabelText('group')).length).toBe(groups.length)

  for (const group of groups) {
    expect(await findByText(group)).toBeInTheDocument()
  }

  // Each group cell has the correct value
  for (const [attendeeIndex, attendee] of attendees.entries()) {
    for (const key of Object.keys(attendee.groups)) {
      expect((await findAllByLabelText(key))[attendeeIndex].textContent).toBe(
        attendee.groups[key],
      )
    }
  }
})

it('should remove empty groups', async () => {
  const groups = Array.from(
    {length: faker.random.number({min: 2, max: 3})},
    faker.random.word,
  )

  const attendees = groups.map((group) =>
    fakeAttendee({groups: {[group]: faker.random.word()}}),
  )

  const targetIndex = faker.random.number({min: 0, max: groups.length - 1})

  const attendee = attendees[targetIndex]
  const group = groups[targetIndex]

  const {findAllByLabelText, findByLabelText} = await goToAttendeeManagement({
    attendees,
  })

  user.click((await findAllByLabelText('edit'))[targetIndex])
  user.type(await findByLabelText(`${group} input`), '')

  const updated = {
    ...attendee,
    groups: {},
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('save'))

  await wait(async () => {
    expect((await findAllByLabelText('group')).length).toBe(groups.length - 1) // Empty group was removed
  })
})

it('should search for an attendee', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeAttendee,
  )

  const target = faker.random.arrayElement(attendees)

  const {findAllByLabelText, findByLabelText} = await goToAttendeeManagement({
    attendees,
  })

  const searchInput = await findByLabelText('search for attendee')

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: fakePaginate({data: [target]})}),
  )

  fireEvent.change(searchInput, {
    target: {
      value: target.first_name,
    },
  })

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(11)
  })

  const [url] = mockGet.mock.calls[10]

  expect(url).toMatch(`search=${target.first_name}`)

  // Updated list to only show results
  expect((await findAllByLabelText('name')).length).toBe(1)
})
