import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {wait} from '@testing-library/react'

const mockPut = axios.put as jest.Mock

it('should add a language', async () => {
  const event = fakeEvent()

  const {findByLabelText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const translationsEnabled = {
    ...event,
    localization: {
      translationsEnabled: true,
    },
  }

  mockPut.mockImplementationOnce(() =>
    Promise.resolve({data: translationsEnabled}),
  )

  user.click(await findByLabelText('toggle translations enabled'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  // Updated event
  expect(url).toMatch(`/events/${event.slug}`)

  // Started false, and checked to true
  expect(data.localization.translationsEnabled).toBe(true)
})
