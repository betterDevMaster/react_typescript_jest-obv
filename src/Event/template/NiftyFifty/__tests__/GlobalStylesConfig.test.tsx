import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'
import axios from 'axios'
import {goToGlobalStylesConfig} from 'organization/Event/Page/__utils__/go-to-global-styles-config'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure global styles settings', async () => {
  const event = fakeEvent({
    template: fakeNiftyFifty(),
  })

  const {findByLabelText} = await goToGlobalStylesConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const color = '#000000'
  user.type(await findByLabelText('text color'), color)
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template['linkColor']).toBe(color)
})
