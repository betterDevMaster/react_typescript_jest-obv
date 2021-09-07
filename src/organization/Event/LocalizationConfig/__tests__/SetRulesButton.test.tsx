import {fakeEvent, fakeLocalization} from 'Event/__utils__/factory'
import faker from 'faker'
import user from '@testing-library/user-event'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {fireEvent, wait} from '@testing-library/react'
import {createLanguage} from 'Event/LanguageProvider/language'
import {TAGS} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule'

const mockPut = axios.put as jest.Mock

it('should set rules', async () => {
  const language = createLanguage('Foo')

  const event = fakeEvent({
    localization: fakeLocalization({
      languages: [language],
      defaultLanguage: 'Foo',
    }),
  })

  const {findByLabelText, findByText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('set rules'))

  user.click(await findByLabelText('add rule'))

  // Select tags as source

  fireEvent.mouseDown(await findByLabelText('pick rule source'))
  user.click(await findByText(TAGS))

  const target = faker.random.word()
  user.type(await findByLabelText('new tag target'), target)

  mockPut.mockImplementationOnce(() => Promise.resolve({data: event}))

  user.click(await findByLabelText('save rule'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  // Updated event
  expect(url).toMatch(`/events/${event.slug}`)

  // Includes new rule
  expect(data.localization.languages[0]['rules'].length).toBe(1)
  expect(data.localization.languages[0]['rules'][0]['target']).toBe(target)
})
