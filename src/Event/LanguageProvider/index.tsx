import {ObvioEvent} from 'Event'
import {useEvent} from 'Event/EventProvider'
import {
  Language,
  ENGLISH,
  createLanguage,
} from 'Event/LanguageProvider/language'
import React, {useCallback, useEffect, useState} from 'react'
import {hasMatch} from 'Event/visibility-rules/matcher'
import {useAttendeeProfile} from 'Event/visibility-rules/AttendeeProfileProvider'

interface LanguageContextProps {
  current: Language['name'] | null
  loading: boolean
  languages: Language[]
  set: (value: Language) => void
  translationsEnabled: boolean
  defaultLanguage: Language['name']
}

export const LanguageContext =
  React.createContext<LanguageContextProps | undefined>(undefined)

export default function EventLanguageProvider(props: {
  children: React.ReactElement
}) {
  const [current, setCurrent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const {event} = useEvent()
  const tokenKey = useLanguageTokenKey()
  const languages = getLanguages(event)
  const translationsEnabled = event.localization?.translationsEnabled || false
  const defaultLanguage = event.localization?.defaultLanguage || ENGLISH
  const saved = window.localStorage.getItem(tokenKey)
  const {groups, tags} = useAttendeeProfile()

  /**
   * Load a saved language
   */

  useEffect(() => {
    if (saved) {
      setCurrent(saved)
    }

    setLoading(false)
  }, [saved])

  const set = useCallback(
    (language: Language) => {
      window.localStorage.setItem(tokenKey, language.name)
      setCurrent(language.name)
    },
    [tokenKey],
  )

  /**
   * Match a language based on rules. If no language has been saved (selected), then
   * we'll check to see if the attendee matches any Language rules. If they
   * do we'll select that language as a default.
   */
  useEffect(() => {
    if (saved) {
      return
    }

    const matchedLanguage = languages.find((l) =>
      hasMatch({groups, tags}, l.rules),
    )
    if (!matchedLanguage) {
      return
    }

    set(matchedLanguage)
  }, [groups, tags, languages, set, saved])

  return (
    <LanguageContext.Provider
      value={{
        current,
        loading,
        set,
        languages,
        translationsEnabled,
        defaultLanguage,
      }}
    >
      {props.children}
    </LanguageContext.Provider>
  )
}

export function OrganizationLanguageProvider(props: {
  language?: Language
  children: React.ReactElement
}) {
  const language = props.language?.name || ENGLISH
  const {event} = useEvent()
  const languages = getLanguages(event)
  const translationsEnabled = event.localization?.translationsEnabled || false
  const defaultLanguage = event.localization?.defaultLanguage || ENGLISH

  /**
   * No-op since you shouldn't set a language when using the OrganizationLanguagesProvider
   */
  const set = () => {}

  return (
    <LanguageContext.Provider
      value={{
        current: language,
        set,
        loading: false,
        languages,
        translationsEnabled,
        defaultLanguage,
      }}
    >
      {props.children}
    </LanguageContext.Provider>
  )
}

/**
 * Language token key used to store the attendee's preferred
 * language in local storage.
 */

function useLanguageTokenKey() {
  const {event} = useEvent()
  return languageTokenKey(event)
}

export function languageTokenKey(event: ObvioEvent) {
  return `__obvio__${event.slug}__language__`
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}

function getLanguages(event: ObvioEvent) {
  const defaultLanguages = [createLanguage(ENGLISH)]

  const definedLanguages = event.localization?.languages
  if (!definedLanguages) {
    return defaultLanguages
  }

  const isEmpty = definedLanguages.length === 0
  if (isEmpty) {
    return defaultLanguages
  }

  return definedLanguages
}
