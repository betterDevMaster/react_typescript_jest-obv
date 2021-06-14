import {fakeBlogPost} from 'Event/Dashboard/components/BlogPost/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import {Translations} from 'Event/LanguageProvider/translations'
import {fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createEntityList} from 'lib/list'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {createLanguage, ENGLISH} from 'Event/LanguageProvider/language'
import {languageTokenKey} from 'Event/LanguageProvider'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'

it('should update user language', async () => {
  const attendee = fakeAttendee({
    tech_check_completed_at: 'now',
    waiver: 'some_waiver.png',
  })

  const SPANISH = 'Spanish'

  const key = 'my_translated_post'

  const post = fakeBlogPost({
    content: `<div>{{${key}}}</div>`,
  })

  const englishText = faker.lorem.paragraph()
  const spanishText = `hola ${faker.lorem.paragraph()}`

  const translations: Translations = {
    [ENGLISH]: {
      [key]: englishText,
    },
    [SPANISH]: {
      [key]: spanishText,
    },
  }

  const event = fakeEvent({
    template: fakePanels({
      blogPosts: createEntityList([post]),
    }),
    localization: {
      translationsEnabled: true,
      translations,
      languages: [createLanguage(ENGLISH), createLanguage(SPANISH)],
    },
  })

  const {findByText, findByLabelText, queryByText} = await loginToEventSite({
    event,
    attendee,
  })

  // Starts off rendering default english
  expect(await findByText(englishText)).toBeInTheDocument()

  user.click(await findByLabelText('change language'))
  user.click(await findByText(SPANISH))

  // Translated into spanish...
  expect(await findByText(spanishText)).toBeInTheDocument()
  // Not showing english
  expect(queryByText(englishText)).not.toBeInTheDocument()

  const savedPreference = window.localStorage.getItem(languageTokenKey(event))
  expect(savedPreference).toBe(SPANISH)
})
