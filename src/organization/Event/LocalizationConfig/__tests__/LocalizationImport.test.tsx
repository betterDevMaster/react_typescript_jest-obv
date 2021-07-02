import {fireEvent, wait} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {ObvioEvent} from 'Event'

const mockPost = axios.post as jest.Mock

it('should update localization values', async () => {
  const event = fakeEvent()

  const {findByLabelText, findByText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const fileInput = await findByLabelText('localization import input')
  const translationsFile = new File([], 'translations.csv')

  Object.defineProperty(fileInput, 'files', {
    value: [translationsFile],
  })

  const withImportedTranslations: ObvioEvent = {
    ...event,
    localization: {
      languages: [
        {
          name: 'English',
          rules: [],
        },
      ],
      translations: {
        English: {
          foo: 'bar',
        },
      },
    },
  }

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: withImportedTranslations,
    }),
  )

  fireEvent.change(fileInput)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  // Imported translations shown
  expect(
    ((await findByLabelText('translation key')) as HTMLInputElement).value,
  ).toBe('foo')
  expect(
    ((await findByLabelText('translation value')) as HTMLInputElement).value,
  ).toBe('bar')
})
