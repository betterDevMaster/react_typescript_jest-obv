import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToEventConfig} from 'organization/Event/__utils__/event'
import axios from 'axios'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update global styles', async () => {
  const event = fakeEvent({
    template: fakeNiftyFifty({
      dashboardLogo: null,
    }),
  })
  const {findByLabelText} = await goToEventConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('global styles'))

  const color = '#e7e7e7'
  user.type(await findByLabelText('text color'), color)

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['textColor']).toBe(color)
})
