import {fakeEvent, fakeLocalization} from 'Event/__utils__/factory'
import faker from 'faker'
import user from '@testing-library/user-event'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {fireEvent, wait} from '@testing-library/react'
import {createLanguage} from 'Event/LanguageProvider/language'

const mockPut = axios.put as jest.Mock

it('should provide translations', async () => {
  const firstLanguage = 'English'
  const secondLanguage = 'Spanish'

  const languages = [
    createLanguage(firstLanguage),
    createLanguage(secondLanguage),
  ]

  const event = fakeEvent({
    localization: fakeLocalization({
      languages,
      defaultLanguage: firstLanguage,
      translations: undefined,
    }),
  })

  const {findByLabelText, findByText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('add field'))

  const key = faker.random.word()
  user.type(await findByLabelText('translation key'), key)

  const value = faker.random.word()
  user.type(await findByLabelText('translation value'), value)

  const withTranslations = {
    ...event,
    localization: {
      ...event.localization,
      translations: {
        [firstLanguage]: {
          [key]: value,
        },
      },
    },
  }

  mockPut.mockImplementationOnce(() =>
    Promise.resolve({data: withTranslations}),
  )

  user.click(await findByLabelText('save translations'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  // Updated event
  expect(url).toMatch(`/events/${event.slug}`)

  // Did save value to key
  expect(data.localization.translations[firstLanguage][key]).toBe(value)

  // Go to another language
  fireEvent.mouseDown(await findByLabelText('language select'))
  user.click(await findByText(secondLanguage))

  // Key was dynamically added based on default language key
  expect(
    ((await findByLabelText('translation key')) as HTMLInputElement).value,
  ).toBe(key)

  expect(
    ((await findByLabelText('translation value')) as HTMLInputElement).value,
  ).toBe('')
})

it('should remove keys from secondary languages', async () => {
  const defaultLanguage = 'English'
  const otherLanguage = 'Spanish'

  const targetKey = 'post_title'
  const otherKey = 'post_body'

  const event = fakeEvent({
    localization: fakeLocalization({
      languages: [
        createLanguage(defaultLanguage),
        createLanguage(otherLanguage),
      ],
      defaultLanguage: defaultLanguage,
      /**
       * Has translatons for every key...
       */
      translations: {
        [defaultLanguage]: {
          [targetKey]: faker.random.word(),
          [otherKey]: faker.random.word(),
        },
        [otherLanguage]: {
          [targetKey]: faker.random.word(),
          [otherKey]: faker.random.word(),
        },
      },
    }),
  })

  const {findByLabelText, findAllByLabelText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click((await findAllByLabelText('remove option'))[0])

  const removed = {
    ...event,
    localization: {
      ...event.localization,
      translations: {
        [defaultLanguage]: {
          [otherKey]: faker.random.word(),
        },
        [otherLanguage]: {
          [otherKey]: faker.random.word(),
        },
      },
    },
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: removed}))

  user.click(await findByLabelText('save translations'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)

  // Removed key from default language
  expect(
    data.localization.translations[defaultLanguage][targetKey],
  ).toBeUndefined()

  // Still contains other key
  expect(
    data.localization.translations[defaultLanguage][otherKey],
  ).not.toBeUndefined()

  // Also removed key from other language
  expect(
    data.localization.translations[otherLanguage][targetKey],
  ).toBeUndefined()
})
