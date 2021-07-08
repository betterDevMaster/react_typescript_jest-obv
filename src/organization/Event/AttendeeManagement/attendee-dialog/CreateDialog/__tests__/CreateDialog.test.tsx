import faker from 'faker'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'
import {fireEvent, wait} from '@testing-library/react'
import {UPDATE_ATTENDEES} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add a new', async () => {
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
    findByLabelText,
    event,
    findAllByLabelText,
  } = await goToAttendeeManagement({
    attendees,
    userPermissions: [UPDATE_ATTENDEES],
  })

  user.click(await findByLabelText('add attendee'))

  // Base Attributes
  const firstName = faker.name.firstName()
  user.type(await findByLabelText('first name'), firstName)

  const lastName = faker.name.lastName()
  user.type(await findByLabelText('last name'), lastName)

  const email = faker.internet.email()
  user.type(await findByLabelText('email input'), email)

  // Add a tag
  const newTag = faker.random.word()
  user.type(await findByLabelText('tags'), newTag)
  fireEvent.keyDown(await findByLabelText('tags'), {key: 'Enter'})

  // Update group value
  const existingGroupValue = faker.random.word()
  user.type(await findByLabelText(`${group} input`), existingGroupValue)

  // Add a new group
  const newGroupKey = faker.random.word()
  const newGroupValue = faker.random.word()
  user.click(await findByLabelText('add group'))
  user.type(await findByLabelText('group name'), newGroupKey)
  user.type(await findByLabelText('group value'), newGroupValue)

  const attendee = fakeAttendee({
    tags: [...tags, newTag],
    groups: {
      [group]: existingGroupValue,
      [newGroupKey]: newGroupValue,
    },
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: attendee}))

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/attendees`)

  expect(data.first_name).toBe(firstName)
  expect(data.tags.includes(newTag)).toBe(true)
  expect(data.groups[group]).toBe(existingGroupValue)
  expect(data.groups[newGroupKey]).toBe(newGroupValue)

  // Added new attendee to list
  expect((await findAllByLabelText('name')).length).toBe(attendees.length + 1)
})
