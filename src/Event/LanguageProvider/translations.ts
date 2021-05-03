import {useEvent} from 'Event/EventProvider'
import {useDefaultLanguage, useLanguage} from 'Event/LanguageProvider'
import {Language} from 'Event/LanguageProvider/language'
import {systemDefault} from 'Event/LanguageProvider/system'
import {replace, parseVariables} from 'lib/template'
import {useCallback} from 'react'

type TranslatedFields = Record<string, string>

export interface Localization {
  defaultLanguage?: Language | null
  translations: {
    [P in Language]?: TranslatedFields | null
  }
}

export type Translations = Localization['translations']

export function useWithTranslations() {
  const {language} = useLanguage()
  const translate = useTranslate()
  const defaultLanguage = useDefaultLanguage()

  return useCallback(
    (text: string) => {
      if (!text) {
        return text
      }

      /**
       * If user (attendee) doesn't have a preferred language set, lets
       * just return the default language translation
       */

      if (!language) {
        return translate(text, defaultLanguage)
      }

      return translate(text, language)
    },
    [language, translate, defaultLanguage],
  )
}

function useTranslate() {
  const {event} = useEvent()

  return useCallback(
    (text: string, language: Language) => {
      let result = text

      const keys = parseVariables(text)

      for (const key of keys) {
        const value = findTranslation(
          key,
          language,
          event.localization?.translations,
        )
        if (!value) {
          /**
           * No text replacement for given key. We'll skip replacing, and leave
           * the text as a {{variable}}.
           */
          continue
        }

        result = replace(key, value, result)
      }

      return result
    },
    [event],
  )
}

function findTranslation(
  key: string,
  language: Language,
  translations?: Translations,
) {
  if (!translations) {
    return systemDefault(key)
  }

  const definition = translations[language]
  if (!definition) {
    return systemDefault(key)
  }

  const value = definition[key]
  if (!value) {
    return systemDefault(key)
  }

  return value
}
