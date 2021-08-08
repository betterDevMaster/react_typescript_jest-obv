import {wait} from '@testing-library/react'
import {fakeEvent, fakeLocalization} from 'Event/__utils__/factory'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import user from '@testing-library/user-event'
import faker from 'faker'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {createLanguage} from 'Event/LanguageProvider/language'

const mockGet = axios.get as jest.Mock

beforeAll(() => {
  // Hide JSDOM nav unimplemented error
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should export localization', async () => {
  const csv = faker.random.alphaNumeric(20)
  window.URL.createObjectURL = jest.fn()
  window.URL.revokeObjectURL = jest.fn()

  const languages = [createLanguage('English'), createLanguage('Bar')]

  const event = fakeEvent({
    localization: fakeLocalization({
      languages,
      defaultLanguage: 'English',
    }),
  })

  const {findByLabelText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: {data: csv}}))

  user.click(await findByLabelText('export localization'))

  await wait(() => {
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })

  const blob = (window.URL.createObjectURL as jest.Mock).mock.calls[0][0]

  // Test that we are downloading returned file contents
  const reader = new FileReader()
  reader.addEventListener('loadend', () => {
    expect(reader.result).toBe(csv)
    // reader.result contains the contents of blob as a typed array
  })
  reader.readAsText(blob)
})
