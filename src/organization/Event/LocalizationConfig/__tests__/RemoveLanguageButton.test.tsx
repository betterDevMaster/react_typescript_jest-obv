import {fakeEvent, fakeLocalization} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {fireEvent, wait} from '@testing-library/react'

const mockPut = axios.put as jest.Mock

it('should remove a language', async () => {
  const defaultLanguage = 'English'
  const target = 'Chinese'
  const languages = [defaultLanguage, target]

  /**
   * Have translations for everything
   */

  const translations = {
    [defaultLanguage]: {
      foo: '1',
      baz: '2',
    },
    [target]: {
      foo: '3',
      baz: '4',
    },
  }

  const event = fakeEvent({
    localization: fakeLocalization({
      languages,
      defaultLanguage,
      translations,
    }),
  })

  const {findByLabelText, findByText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  // Select another language
  fireEvent.mouseDown(await findByLabelText('language select'))
  user.click(await findByText(target))

  const {[target]: removedTranslation, ...otherTranslations} = translations

  const removed = {
    ...event,
    localization: {
      ...event.localization,
      languages: [defaultLanguage],
      translations: {...otherTranslations},
    },
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: removed}))

  user.click(await findByLabelText('remove language'))
  user.click(await findByLabelText('confirm remove'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  // Updated event
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.localization.languages.length).toBe(languages.length - 1)

  // language removed from array
  expect(data.localization.languages.includes(target)).toBe(false)

  // Translations removed
  expect(data.localization.translations[target]).toBeUndefined()
})
