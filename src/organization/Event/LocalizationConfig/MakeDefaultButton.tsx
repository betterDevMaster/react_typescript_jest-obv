import {useUpdate} from 'Event/EventProvider'
import {useDefaultLanguage} from 'Event/LanguageProvider'
import {Language} from 'Event/LanguageProvider/language'
import {Translations} from 'Event/LanguageProvider/translations'
import React from 'react'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

export default function MakeDefaultField(props: {
  language: Language
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  translations: Translations
}) {
  const {isProcessing, setIsProcessing, language, translations} = props
  const defaultLanguage = useDefaultLanguage()
  const updateEvent = useUpdate()

  const isDefault = language === defaultLanguage

  const setDefault = () => {
    if (isProcessing || isDefault) {
      return
    }

    setIsProcessing(true)

    const updates = {
      localization: {
        defaultLanguage: language,
        translations: createTranslations({
          prevDefault: defaultLanguage,
          newDefault: language,
          translations,
        }),
      },
    }

    updateEvent(updates).finally(() => {
      setIsProcessing(false)
    })
  }

  return (
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <Button
        onClick={setDefault}
        variant="outlined"
        disabled={isDefault || isProcessing}
      >
        Make Default
      </Button>
    </Box>
  )
}

function createTranslations({
  prevDefault,
  newDefault,
  translations,
}: {
  prevDefault: Language
  newDefault: Language
  translations: Translations
}) {
  const currentDefaults = translations[prevDefault]
  if (!currentDefaults) {
    return translations
  }

  return Object.entries(translations).reduce((acc, [key, value]) => {
    if (key !== newDefault && value) {
      acc[key] = value
      return acc
    }

    acc[key] = copyKeys(currentDefaults, value)
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
