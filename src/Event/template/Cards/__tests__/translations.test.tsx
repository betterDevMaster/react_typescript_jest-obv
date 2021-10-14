import React from 'react'
import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPost/__utils__/factory'
import {createEntityList} from 'lib/list'
import {render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {
  Translations,
  useWithAttendeeTranslations,
} from 'Event/LanguageProvider/translations'
import {SYSTEM_DEFAULTS} from 'Event/LanguageProvider/system'
import {languageTokenKey} from 'Event/LanguageProvider'

it('should show translated text content', async () => {
  const key = 'my_translated_post'

  const post = fakeBlogPost({
    content: `<div>{{${key}}}</div>`,
  })

  const text = faker.lorem.paragraph()

  const translations: Translations = {
    English: {
      [key]: text,
    },
  }

  const {findByText} = render(<TranslatedText>{`{{${key}}}`}</TranslatedText>, {
    event: fakeEvent({
      template: fakeCards({
        blogPosts: createEntityList([post]),
      }),
      localization: {
        translations,
        translationsEnabled: true,
      },
    }),
  })

  expect(await findByText(text)).toBeInTheDocument()
})

it('should fallback to default language', async () => {
  const key = 'my_translated_post'
  const French = 'French'

  const post = fakeBlogPost({
    content: `<div>{{${key}}}</div>`,
  })

  const text = faker.lorem.paragraph()

  const translations: Translations = {
    // English is the default
    English: {
      [key]: text,
    },
    // French is selected but is not defined
  }

  const event = fakeEvent({
    template: fakeCards({
      blogPosts: createEntityList([post]),
    }),
    localization: {
      translations,
      translationsEnabled: true,
    },
  })

  // select language
  window.localStorage.setItem(languageTokenKey(event), French)

  const {findByText} = render(<TranslatedText>{`{{${key}}}`}</TranslatedText>, {
    event,
  })

  expect(await findByText(text)).toBeInTheDocument()
})

it('should show system default', async () => {
  const systemKey = 'waiver.submit'

  const post = fakeBlogPost({
    content: `<div>{{${systemKey}}}</div>`,
  })

  /**
   * Event without any translations
   */
  const event = fakeEvent({
    template: fakeCards({
      blogPosts: createEntityList([post]),
    }),
    localization: {
      translationsEnabled: true,
    },
  })

  const {findByText} = render(
    <TranslatedText>{`{{${systemKey}}}`}</TranslatedText>,
    {
      event,
    },
  )

  expect(await findByText(SYSTEM_DEFAULTS.waiver.submit)).toBeInTheDocument()
})

/**
 * Helper Text Component to render translations
 *
 * @param props
 * @returns
 */

function TranslatedText(props: {children: string}) {
  const withTranslations = useWithAttendeeTranslations()
  return <div>{withTranslations(props.children)}</div>
}
