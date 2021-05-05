import {useEvent, useUpdate} from 'Event/EventProvider'
import {useLanguage} from 'Event/LanguageProvider'
import {Language} from 'Event/LanguageProvider/language'
import {Translations} from 'Event/LanguageProvider/translations'
import React from 'react'
import Button from '@material-ui/core/Button'
import {useLocalizationConfig} from 'organization/Event/LocalizationConfig'

export default function MakeDefaultButton(props: {
  language: Language
  translations: Translations
  className?: string
}) {
  const {language, translations} = props
  const {isProcessing, setIsProcessing} = useLocalizationConfig()
  const updateEvent = useUpdate()
  const {event} = useEvent()
  const {languages, defaultLanguage} = useLanguage()

  const isDefault = language === defaultLanguage

  const setDefault = () => {
    if (isProcessing || isDefault) {
      return
    }

    setIsProcessing(true)

    const updates = {
      localization: {
        ...(event.localization || {}),
        defaultLanguage: language,
        translations: createTranslations({
          prevDefault: defaultLanguage,
          newDefault: language,
          languages,
          translations,
        }),
      },
    }

    updateEvent(updates).finally(() => {
      setIsProcessing(false)
    })
  }

  return (
    <Button
      onClick={setDefault}
      variant="outlined"
      disabled={isDefault || isProcessing}
      className={props.className}
      aria-label="make default"
    >
      Make Default
    </Button>
  )
}

function createTranslations({
  prevDefault,
  newDefault,
  languages,
  translations,
}: {
  prevDefault: Language
  newDefault: Language
  languages: Language[]
  translations: Translations
}) {
  const currentDefaults = translations[prevDefault]
  if (!currentDefaults) {
    return translations
  }

  return languages.reduce((acc, language) => {
    const value = translations[language]

    if (language !== newDefault && value) {
      acc[language] = value
      return acc
    }

    acc[language] = copyKeys(currentDefaults, value)
    return acc
  }, {} as Record<string, Record<string, string>>)
}

function copyKeys(
  base: Record<string, string>,
  target?: Record<string, string> | null,
) {
  /**
   * Secondary language doesn't have any translations, we'll
   * initialize with empty values to prevent switching
   * default language causing different keys.
   */
  if (!target) {
    return Object.keys(base).reduce((acc, key) => {
      acc[key] = ''
      return acc
    }, {} as Record<string, string>)
  }

  /**
   * Set existing values if we have them translated
   */
  return Object.keys(base).reduce((acc, key) => {
    const value = target[key]
    acc[key] = value || ''

    return acc
  }, {} as Record<string, string>)
}
