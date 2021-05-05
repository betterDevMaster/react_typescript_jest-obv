import {ObvioEvent} from 'Event'
import {useEvent} from 'Event/EventProvider'
import {Language, ENGLISH} from 'Event/LanguageProvider/language'
import React, {useEffect, useState} from 'react'

interface LanguageContextProps {
  current: Language | null
  loading: boolean
  languages: Language[]
  set: (value: Language) => void
  translationsEnabled: boolean
  defaultLanguage: Language
}

export const LanguageContext = React.createContext<
  LanguageContextProps | undefined
>(undefined)

export default function EventLanguageProvider(props: {
  children: React.ReactElement
}) {
  const [current, setCurrent] = useState<Language | null>(null)
  const [loading, setLoading] = useState(true)
  const {event} = useEvent()
  const tokenKey = useLanguageTokenKey()
  const languages = event.localization?.languages || [ENGLISH]
  const translationsEnabled = event.localization?.translationsEnabled || false
  const defaultLanguage = event.localization?.defaultLanguage || ENGLISH

  /**
   * Load a saved language
   */

  useEffect(() => {
    const saved = window.localStorage.getItem(tokenKey)
    if (saved) {
      setCurrent(saved)
    }

    setLoading(false)
  }, [tokenKey])

  const set = (language: Language) => {
    window.localStorage.setItem(tokenKey, language)
    setCurrent(language)
  }

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
  const language = props.language || ENGLISH
  const {event} = useEvent()
  const languages = event.localization?.languages || [ENGLISH]
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
