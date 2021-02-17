import faker from 'faker'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {Attendee} from 'Event/attendee'
import {formatDate, now} from 'lib/date-time'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'
import {fireEvent, wait} from '@testing-library/react'

const mockPatch = axios.patch as jest.Mock

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
  })

  const targetIndex = faker.random.number({min: 0, max: attendees.length - 1})
  const target = attendees[targetIndex]
  const today = now()
  const updated: Attendee = {...target, tech_check_completed_at: today}

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  // Complete tech check
  user.click(
    (await findAllByLabelText('mark as completed tech check'))[targetIndex],
  )

  // checked-in shows today's date
  expect(
    (await findByLabelText('date of completing tech check')).textContent,
  ).toBe(formatDate(today))
})

it('should render attendee groups', async () => {
  const groups = Array.from(
    {length: faker.random.number({min: 2, max: 3})},
    faker.random.word,
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

it('should edit an attendee', async () => {
  const group = faker.random.word()
  const tags = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    faker.random.word,
  )

  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    () =>
      fakeAttendee({
        groups: {[group]: faker.random.word()},
        tags,
      }),
  )

  const {
    findAllByLabelText,
    findByLabelText,
    event,
  } = await goToAttendeeManagement({
    attendees,
  })

  const targetIndex = faker.random.number({min: 0, max: attendees.length - 1})
  const target = attendees[targetIndex]

  user.click((await findAllByLabelText('edit'))[targetIndex])

  // Update normal attribute
  const newName = faker.name.firstName()
  user.type(await findByLabelText('first name'), newName)

  // Add a tag
  const newTag = faker.random.word()
  user.type(await findByLabelText('tags'), newTag)
  fireEvent.keyDown(await findByLabelText('tags'), {key: 'Enter'})

  // Update group value
  const updatedGroupValue = faker.random.word()
  user.type(await findByLabelText(`${group} input`), updatedGroupValue)

  // Add a new group
  const newGroupKey = faker.random.word()
  const newGroupValue = faker.random.word()
  user.click(await findByLabelText('add group'))
  user.type(await findByLabelText('group name'), newGroupKey)
  user.type(await findByLabelText('group value'), newGroupValue)

  const updated = {
    ...target,
    first_name: newName,
    tags: [...tags, newTag],
    groups: {
      [group]: updatedGroupValue,
      [newGroupKey]: newGroupValue,
    },
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/attendees/${target.id}`)

  expect(data.first_name).toBe(newName)
  expect(data.tags.length).toBe(tags.length + 1)
  expect(data.tags.includes(newTag)).toBe(true)
  expect(data.groups[group]).toBe(updatedGroupValue)
  expect(data.groups[newGroupKey]).toBe(newGroupValue)
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
