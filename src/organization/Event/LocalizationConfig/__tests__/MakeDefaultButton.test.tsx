import {fakeEvent, fakeLocalization} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {fireEvent, wait} from '@testing-library/react'

const mockPut = axios.put as jest.Mock

it('should copy keys when setting as default', async () => {
  const prevDefault = 'English'
  const newDefault = 'Chinese'
  const languages = [prevDefault, newDefault]

  /**
   * New default started with less translated fields
   * than the current default.
   */

  const missingKey = 'somemissingkey'

  const translations = {
    [prevDefault]: {
      foo: '1',
      [missingKey]: '2',
      baz: '3',
    },
    [newDefault]: {
      foo: '4',
      baz: '5',
    },
  }

  const event = fakeEvent({
    localization: fakeLocalization({
      languages,
      defaultLanguage: prevDefault,
      translations,
    }),
  })

  const {findByLabelText, findByText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  // Select another language
  fireEvent.mouseDown(await findByLabelText('language select'))
  user.click(await findByText(newDefault))

  const copied = {
    ...translations,
    [newDefault]: {
      ...translations[newDefault],
      [missingKey]: '', // Copied this key over with blank value
    },
  }

  const withKeys = {
    ...event,
    localization: {
      ...event.localization,
      translations: copied,
    },
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: withKeys}))

  user.click(await findByLabelText('make default'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  // Updated event
  expect(url).toMatch(`/events/${event.slug}`)

  // Updated default
  expect(data.localization.defaultLanguage).toBe(newDefault)

  const prevDefaultValues = data.localization.translations[prevDefault]
  const newDefaultValues = data.localization.translations[newDefault]

  // Same number of keys
  expect(Object.keys(prevDefaultValues).length).toBe(
    Object.keys(newDefaultValues).length,
  )

  // Did copy missing key
  expect(newDefaultValues[missingKey]).toBe('')

  // Other fields were unchanged
  expect(data.localization.languages).toMatchObject(languages)
})
