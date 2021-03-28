import faker from 'faker'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'
import {fireEvent, wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPatch = axios.patch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
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
    userPermissions: [CONFIGURE_EVENTS],
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

it('should copy the login url', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    fakeAttendee,
  )

  const {findAllByLabelText, findByLabelText} = await goToAttendeeManagement({
    attendees,
  })

  const targetIndex = faker.random.number({min: 0, max: attendees.length - 1})
  const target = attendees[targetIndex]

  user.click((await findAllByLabelText('edit'))[targetIndex])

  const copy = jest.fn(() => Promise.resolve())

  Object.assign(navigator, {
    clipboard: {
      writeText: copy,
    },
  })

  user.click(await findByLabelText('copy login url'))

  await wait(() => {
    expect(copy).toHaveBeenCalledWith(target.login_url)
  })
})
