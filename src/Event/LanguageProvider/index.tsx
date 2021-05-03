import {useEvent} from 'Event/EventProvider'
import {
  isLanguage,
  Language,
  SYSTEM_DEFAULT_LANGUAGE,
} from 'Event/LanguageProvider/language'
import React, {useEffect, useState} from 'react'
interface LanguageContextProps {
  language: Language | null
  loading: boolean
  set: (value: Language) => void
}

const LanguageContext = React.createContext<LanguageContextProps | undefined>(
  undefined,
)

export default function LanguageProvider(props: {
  children: React.ReactElement
}) {
  const [language, setLanguage] = useState<Language | null>(null)
  const [loading, setLoading] = useState(true)
  const tokenKey = useLanguageTokenKey()

  /**
   * Load a saved language
   */

  useEffect(() => {
    const saved = window.localStorage.getItem(tokenKey)
    if (saved && isLanguage(saved)) {
      setLanguage(saved)
    }

    setLoading(false)
  }, [tokenKey])

  const set = (language: Language) => {
    window.localStorage.setItem(tokenKey, language)
    setLanguage(language)
  }

  return (
    <LanguageContext.Provider value={{language, loading, set}}>
      {props.children}
    </LanguageContext.Provider>
  )
}

export function StaticLanguageProvider(props: {
  language?: Language
  children: React.ReactElement
}) {
  const language = props.language || SYSTEM_DEFAULT_LANGUAGE

  /**
   * No-op since you shouldn't set a language when using the StaticLanguageProvider
   */
  const set = () => {}

  return (
    <LanguageContext.Provider value={{language, set, loading: false}}>
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

  return `__obvio__${event.slug}__language__`
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}

export function useDefaultLanguage() {
  const {event} = useEvent()

  const eventDefault = event.localization?.defaultLanguage
  if (eventDefault) {
    return eventDefault
  }

  return SYSTEM_DEFAULT_LANGUAGE
}
