import {ObvioEvent} from 'Event'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {useLanguage} from 'Event/LanguageProvider'
import {onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import {useLocalizationConfig} from 'organization/Event/LocalizationConfig'
import React from 'react'

export default function EnableTranslationSwitch() {
  const {translationsEnabled} = useLanguage()
  const setTranslationsEnabled = useSetTranslationsEnabled()

  const {isProcessing, setIsProcessing} = useLocalizationConfig()

  const handleToggle = (enabled: boolean) => {
    if (isProcessing) {
      return
    }
    setIsProcessing(true)

    setTranslationsEnabled(enabled).finally(() => {
      setIsProcessing(false)
    })
  }

  return (
    <Switch
      disabled={isProcessing}
      checked={translationsEnabled}
      onChange={onChangeCheckedHandler(handleToggle)}
      color="primary"
      labelPlacement="end"
      label="Enable Translations"
      aria-label="toggle translations enabled"
    />
  )
}

function useSetTranslationsEnabled() {
  const updateEvent = useUpdate()
  const {event} = useEvent()

  return (enabled: boolean) => {
    const data: Partial<ObvioEvent> = {
      localization: {
        ...event.localization,
        translationsEnabled: enabled,
      },
    }

    return updateEvent(data)
  }
}
