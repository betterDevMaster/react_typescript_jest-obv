import {useEvent} from 'Event/EventProvider'
import {useLanguage} from 'Event/LanguageProvider'
import {Language, ENGLISH} from 'Event/LanguageProvider/language'
import {systemDefault} from 'Event/LanguageProvider/system'
import {replace, parseVariables} from 'lib/template'
import {useCallback} from 'react'

type TranslatedFields = Record<string, string>

export interface Localization {
  languages?: Language[]
  defaultLanguage?: Language['name'] | null
  translations?: {
    [P in Language['name']]?: TranslatedFields | null
  }
  translationsEnabled?: boolean
}

export type Translations = NonNullable<Localization['translations']>

export function useWithAttendeeTranslations() {
  const {
    current: language,
    translationsEnabled,
    defaultLanguage,
  } = useLanguage()

  return useHandleText({
    language,
    translationsEnabled,
    defaultLanguage,
  })
}

export function useWithGuestTranslations() {
  const {event} = useEvent()
  const translationsEnabled = event.localization?.translationsEnabled || false
  const language = event.localization?.defaultLanguage || ENGLISH

  return useHandleText({
    language,
    defaultLanguage: language,
    translationsEnabled,
  })
}

function useTranslate() {
  const {event} = useEvent()

  return useCallback(
    ({
      text,
      target,
      fallback,
    }: {
      text: string
      target: Language['name']
      fallback?: Language['name']
    }) => {
      let result = text

      const keys = parseVariables(text)

      for (const key of keys) {
        const value = findTranslation({
          key,
          target,
          fallback,
          translations: event.localization?.translations,
        })
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

function findTranslation({
  key,
  target,
  fallback,
  translations,
}: {
  key: string
  target: Language['name']
  translations?: Translations
  fallback?: Language['name']
}): string | null {
  /**
   * Translations field hasn't been initialized, no
   * translations have been defined. We'll just
   * check if it's a system key.
   */

  if (!translations) {
    return systemDefault(key)
  }

  /**
   * Try to find translations for the intended target (language).
   * If we fail to find one here, we'll try use the fallback
   * language if one is defined.
   */

  const language = translations[target]
  if (!language && fallback) {
    return findTranslation({key, target: fallback, translations})
  }

  if (!language) {
    return systemDefault(key)
  }

  /**
   * Finally we see if the language has the key we're looking for, if not
   * we'll try it in the fallback language.
   */

  const value = language[key]

  if (!value && fallback) {
    return findTranslation({key, target: fallback, translations})
  }

  if (!value) {
    return systemDefault(key)
  }

  /**
   * Found translation!
   */

  return value
}

function useHandleText(options: {
  defaultLanguage: string
  language: string | null
  translationsEnabled: boolean
}) {
  const translate = useTranslate()
  const {defaultLanguage, language, translationsEnabled} = options

  return useCallback(
    (text: string) => {
      if (!text || !translationsEnabled) {
        return text
      }

      /**
       * If user (attendee) doesn't have a preferred language set, lets
       * just return the default language translation
       */

      if (!language) {
        return translate({text, target: defaultLanguage})
      }

      return translate({text, target: language, fallback: defaultLanguage})
    },
    [language, translate, defaultLanguage, translationsEnabled],
  )
}
