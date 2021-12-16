import faker from 'faker'
import {fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {createLanguage, ENGLISH} from 'Event/LanguageProvider/language'
import {languageTokenKey} from 'Event/LanguageProvider'
import {wait} from '@testing-library/dom'
import {AND} from 'Event/attendee-rules'
import {
  INCLUDE,
  TAGS,
} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'

it('should have set a matched language selected', async () => {
  window.localStorage.clear()

  const tag = faker.random.word()

  const attendee = fakeAttendee({
    tech_check_completed_at: 'now',
    waiver: 'some_waiver.png',
    tags: [tag],
  })

  const SPANISH = 'Spanish'

  const event = fakeEvent({
    template: fakeFiftyBlog(),
    localization: {
      translationsEnabled: true,
      defaultLanguage: ENGLISH,
      languages: [
        createLanguage(ENGLISH),
        createLanguage(SPANISH, {
          rules: [
            {
              source: TAGS,
              condition: AND,
              type: INCLUDE,
              target: tag,
            },
          ],
        }),
      ],
    },
  })

  await loginToEventSite({
    event,
    attendee,
  })

  const savedPreference = window.localStorage.getItem(languageTokenKey(event))
  await wait(() => {
    expect(savedPreference).toBe(SPANISH)
  })
})

it('should skip matching if language already selected', async () => {
  window.localStorage.clear()

  const tag = faker.random.word()

  const attendee = fakeAttendee({
    tech_check_completed_at: 'now',
    waiver: 'some_waiver.png',
    tags: [tag],
  })

  const SPANISH = 'Spanish'

  const event = fakeEvent({
    template: fakeFiftyBlog(),
    localization: {
      translationsEnabled: true,
      defaultLanguage: ENGLISH,
      languages: [
        createLanguage(ENGLISH),
        createLanguage(SPANISH, {
          rules: [
            {
              source: TAGS,
              condition: AND,
              type: INCLUDE,
              target: tag,
            },
          ],
        }),
      ],
    },
  })

  // Has a saved (selected) language...
  window.localStorage.setItem(languageTokenKey(event), ENGLISH)

  await loginToEventSite({
    event,
    attendee,
  })

  const savedPreference = window.localStorage.getItem(languageTokenKey(event))
  await wait(() => {
    expect(savedPreference).toBe(ENGLISH)
  })
})
