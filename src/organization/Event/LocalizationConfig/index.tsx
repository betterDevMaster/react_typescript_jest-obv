import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import TranslationForm from 'organization/Event/LocalizationConfig/TranslationForm'
import {Language} from 'Event/LanguageProvider/language'
import LanguageSelect from 'organization/Event/LocalizationConfig/LanguageSelect'
import {useLanguage} from 'Event/LanguageProvider'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {Translations} from 'Event/LanguageProvider/translations'
import MakeDefaultButton from 'organization/Event/LocalizationConfig/MakeDefaultButton'
import Box from '@material-ui/core/Box'
import AddLanguageButton from 'organization/Event/LocalizationConfig/AddLanguageButton'
import EnableTranslationSwitch from 'organization/Event/LocalizationConfig/EnableTranslationSwitch'
import RemoveLanguageButton from 'organization/Event/LocalizationConfig/RemoveLanguageButton'
import SetRulesButton from 'organization/Event/LocalizationConfig/SetRulesButton'

type LocalizationConfigContextProps = {
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

const LocalizationConfigContext = React.createContext<
  LocalizationConfigContextProps | undefined
>(undefined)

export default function LocalizationConfig() {
  const {defaultLanguage} = useLanguage()
  const [language, setLanguage] = useState<Language['name']>(defaultLanguage)
  const [translations, setTranslations] = useState<Translations | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const {event} = useEvent()
  const remove = useRemoveLanguage()

  useEffect(() => {
    const saved = event.localization?.translations

    const translations = saved || {}
    setTranslations(translations)
  }, [event])

  useEffect(() => {
    setLanguage(defaultLanguage)
  }, [defaultLanguage])

  if (!translations) {
    return null
  }

  const canRemove = language !== defaultLanguage && !isProcessing

  const handleRemove = () => {
    if (isProcessing) {
      return
    }
    setIsProcessing(true)
    remove(translations, language)
      .then(() => {
        setLanguage(defaultLanguage)
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  return (
    <Layout>
      <Page>
        <LocalizationConfigContext.Provider
          value={{isProcessing, setIsProcessing}}
        >
          <Box mb={2}>
            <EnableTranslationSwitch />
          </Box>
          <Box mb={2} display="flex" justifyContent="space-between">
            <ButtonsBox>
              <SetRulesButton language={language} />
              <MakeDefaultButton
                language={language}
                translations={translations}
              />
              <RemoveLanguageButton
                onRemove={handleRemove}
                canRemove={canRemove}
                language={language}
              />
            </ButtonsBox>
            <AddLanguageButton onAdd={setLanguage} />
          </Box>
          <LanguageSelect
            value={language}
            onChange={setLanguage}
            showDefault
            disabled={isProcessing}
          />
          <TranslationForm
            language={language}
            translations={translations}
            setTranslations={setTranslations}
          />
        </LocalizationConfigContext.Provider>
      </Page>
    </Layout>
  )
}

export function useLocalizationConfig() {
  const context = React.useContext(LocalizationConfigContext)
  if (context === undefined) {
    throw new Error(
      'useLocalizationConfig must be used within LocalizationConfig',
    )
  }

  return context
}

const ButtonsBox = styled.div`
  margin: ${(props) => `-${props.theme.spacing[1]}`}!important;

  > button {
    margin: ${(props) => props.theme.spacing[1]}!important;
  }
`

function useRemoveLanguage() {
  const {event} = useEvent()
  const updateEvent = useUpdate()
  const {languages} = useLanguage()

  return (translations: Translations, language: Language['name']) => {
    const hasTranslations = Object.prototype.hasOwnProperty.call(
      translations,
      language,
    )

    const removedTranslations = () => {
      if (!hasTranslations) {
        return translations
      }

      const {[language]: removed, ...otherTranslations} = translations
      return otherTranslations
    }

    const removedLanguage = languages.filter((l) => l.name !== language)

    const updates = {
      localization: {
        ...(event.localization || {}),
        translations: removedTranslations(),
        languages: removedLanguage,
      },
    }

    return updateEvent(updates)
  }
}
