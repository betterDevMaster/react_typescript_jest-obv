import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import axios from 'axios'
import {goToEventConfig} from 'organization/Event/__utils__/event'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure check in', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })

  const {findByLabelText} = await goToEventConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('check in'))

  const checkInTitle = faker.lorem.sentence()

  user.type(await findByLabelText('check in title'), checkInTitle)
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template['checkIn.title']).toBe(checkInTitle)
})
