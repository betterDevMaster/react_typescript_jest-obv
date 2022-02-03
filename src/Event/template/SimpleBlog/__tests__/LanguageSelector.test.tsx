import {fakeBlogPost} from 'Event/Dashboard/components/BlogPosts/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import {Translations} from 'Event/LanguageProvider/translations'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createHashMap} from 'lib/list'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {createLanguage, ENGLISH} from 'Event/LanguageProvider/language'
import {languageTokenKey} from 'Event/LanguageProvider'
import {AND} from 'Event/attendee-rules'
import {
  GROUP,
  IS,
} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/GroupRule'

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
    template: fakeSimpleBlog({
      blogPosts: createHashMap([post]),
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

it('should set a dynamic language group', async () => {
  const attendee = fakeAttendee({
    tech_check_completed_at: 'now',
    waiver: 'some_waiver.png',
  })

  const SPANISH = 'Spanish'

  const key = 'my_translated_post'

  const post = fakeBlogPost({
    content: `<div>{{${key}}}</div>`,

    // Have a rule that will only show if the language is Spanish
    rules: [
      {
        condition: AND,
        source: GROUP,
        type: IS,
        key: '__language__', // dynamic key
        target: SPANISH,
      },
    ],
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
    template: fakeSimpleBlog({
      blogPosts: createHashMap([post]),
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

  // English is hidden since it does not match the rule
  expect(queryByText(englishText)).not.toBeInTheDocument()

  user.click(await findByLabelText('change language'))
  user.click(await findByText(SPANISH))

  // Translated into spanish, and is now showing...
  expect(await findByText(spanishText)).toBeInTheDocument()
})
