import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {goToGeneralConfig} from 'organization/Event/GeneralConfig/__utils__/go-to-general-config'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show select template form', async () => {
  const event = fakeEvent({template: null})
  const {findByLabelText} = await goToGeneralConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  expect(await findByLabelText('template select')).toBeInTheDocument()
})

it('should update progress bar color', async () => {
  const event = fakeEvent()
  const {findByLabelText} = await goToGeneralConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const color = '#e7e7e7'
  user.type(await findByLabelText('bar color'), color)

  mockPut.mockResolvedValueOnce({data: event})
  user.click(await findByLabelText('save general config'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.progressBar.barColor).toBe(color)
})
