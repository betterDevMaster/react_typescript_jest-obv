import React, {useEffect, useState} from 'react'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import TranslationForm from 'organization/Event/LocalizationConfig/TranslationForm'
import {Language} from 'Event/LanguageProvider/language'
import LanguageSelect from 'organization/Event/LocalizationConfig/LanguageSelect'
import {useDefaultLanguage} from 'Event/LanguageProvider'
import {useEvent} from 'Event/EventProvider'
import {Translations} from 'Event/LanguageProvider/translations'
import MakeDefaultButton from 'organization/Event/LocalizationConfig/MakeDefaultButton'

export default function LocalizationConfig() {
  const defaultLanguage = useDefaultLanguage()
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [translations, setTranslations] = useState<Translations | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const {event} = useEvent()

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

  return (
    <Layout>
      <Page>
        <MakeDefaultButton
          language={language}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          translations={translations}
        />
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
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </Page>
    </Layout>
  )
}
