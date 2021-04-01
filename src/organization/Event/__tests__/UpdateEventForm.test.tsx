import {goToEventConfig} from 'organization/Event/__utils__/event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import faker from 'faker'
import user from '@testing-library/user-event'
import {act, wait} from '@testing-library/react'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

it('should update event values', async () => {
  const {event, findByLabelText, findByText} = await goToEventConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const name = faker.random.words(2)

  await act(async () => {
    user.type(await findByLabelText('event name'), name)
  })

  const updated = {...event, name}
  mockPut.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('submit'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.name).toBe(name)

  expect(await findByText(name)).toBeInTheDocument()
})
