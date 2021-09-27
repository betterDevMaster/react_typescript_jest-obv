import {goToEventConfig} from 'organization/Event/__utils__/event'
import user from '@testing-library/user-event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fireEvent, wait} from '@testing-library/dom'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update emoji page bg', async () => {
  const {findByLabelText, findByText, event} = await goToEventConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('configure emoji page'))

  const color = '#e7e7e7'
  fireEvent.change(await findByLabelText('solid background'), {
    target: {
      value: color,
    },
  })

  mockPut.mockImplementation(() => Promise.resolve({data: event}))

  user.click(await findByText(/save/i))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.emojiPage.background).toBe(color)
})
