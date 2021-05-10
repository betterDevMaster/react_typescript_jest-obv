import {fakeEvent, fakeLocalization} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {createLanguage, Language} from 'Event/LanguageProvider/language'

const mockPut = axios.put as jest.Mock

it('should add a language', async () => {
  const languages = [createLanguage('Foo'), createLanguage('Bar')]

  const event = fakeEvent({
    localization: fakeLocalization({
      languages,
      defaultLanguage: 'Foo',
    }),
  })

  const {findByLabelText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('add language'))

  const chinese = 'Chinese'
  user.type(await findByLabelText('new language'), chinese)

  const withLanguage = {
    ...event,
    localization: {
      ...event.localization,
      languages: [...languages, createLanguage(chinese)],
    },
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: withLanguage}))

  user.click(await findByLabelText('save language'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  // Updated event
  expect(url).toMatch(`/events/${event.slug}`)

  // Includes new language
  expect(data.localization.languages.length).toBe(languages.length + 1)
  expect(
    data.localization.languages.map((l: Language) => l.name).includes(chinese),
  ).toBe(true)

  // Selected new language
  expect(
    ((await findByLabelText('language select')) as HTMLDivElement).textContent,
  ).toMatch(chinese)
})
