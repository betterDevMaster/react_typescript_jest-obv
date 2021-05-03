import React, {useCallback, useEffect, useMemo, useState} from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {Translations} from 'Event/LanguageProvider/translations'
import {Language} from 'Event/LanguageProvider/language'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {v4 as uuid} from 'uuid'
import {useDefaultLanguage} from 'Event/LanguageProvider'
import FieldInput from 'organization/Event/LocalizationConfig/TranslationForm/FieldInput'
import NewFieldButton from 'organization/Event/LocalizationConfig/TranslationForm/NewFieldButton'

export type Field = {
  id: string
  key: string
  value: string
  isNew: boolean
}

export default function TranslationForm(props: {
  language: Language
  translations: Translations
  setTranslations: (translations: Translations) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}) {
  const {language, translations, isProcessing, setIsProcessing} = props
  const {event} = useEvent()
  const defaultLanguage = useDefaultLanguage()
  const parseValues = useParseValues()

  const isDefaultLanguage = language === defaultLanguage

  const values = useMemo(() => parseValues(language, translations), [
    language,
    translations,
    parseValues,
  ])

  const [fields, setFields] = useState<Field[]>([])

  useEffect(() => {
    const fields = Object.entries(values).map(([key, value]) => ({
      id: uuid(),
      key,
      value,
      isNew: false,
    }))

    setFields(fields)
  }, [values])

  const updateEvent = useUpdate()

  const addField = () => {
    const newField = {
      id: uuid(),
      key: '',
      value: '',
      isNew: true,
    }

    const added = [...fields, newField]
    setFields(added)
  }

  const remove = (target: Field) => {
    const removed = fields.filter((f) => f.id !== target.id)
    setFields(removed)
  }

  const update = (target: Field) => {
    const updated = fields.map((f) => {
      const isTarget = f.id === target.id

      if (isTarget) {
        return target
      }

      return f
    })

    setFields(updated)
  }

  const save = () => {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    const update = {
      localization: {
        ...event.localization,
        translations: {
          ...event.localization?.translations,
          [language]: createValues(fields),
        },
      },
    }

    updateEvent(update).finally(() => {
      setIsProcessing(false)
    })
  }

  const emptyKeys = fields.filter((f) => !f.key)
  const canSave = emptyKeys.length === 0 && !isProcessing

  return (
    <>
      <Box mb={2}>
        {fields.map((field: Field) => (
          <FieldInput
            key={field.id}
            field={field}
            onRemove={() => remove(field)}
            disabled={isProcessing}
            update={update}
            canUpdateKeys={isDefaultLanguage}
          />
        ))}
      </Box>
      <NewFieldButton
        visible={isDefaultLanguage}
        onClick={addField}
        disabled={isProcessing}
      />
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={save}
          fullWidth
          disabled={!canSave}
        >
          Save
        </Button>
      </Box>
    </>
  )
}

function useParseValues() {
  const parseKeys = useParseKeys()

  return useCallback(
    (language: Language, translations: Translations) => {
      const keys = parseKeys(translations)
      return keys.reduce((acc, key) => {
        const values = translations[language]
        if (!values) {
          acc[key] = ''
          return acc
        }

        acc[key] = values[key] || ''
        return acc
      }, {} as Record<string, string>)
    },
    [parseKeys],
  )
}

function useParseKeys() {
  const defaultLanguage = useDefaultLanguage()

  return useCallback(
    (translations: Translations) => {
      const values = translations[defaultLanguage]
      if (!values) {
        return []
      }

      return Object.keys(values)
    },
    [defaultLanguage],
  )
}

function createValues(fields: Field[]) {
  const result = fields.reduce((acc, f) => {
    acc[f.key] = f.value || ''
    return acc
  }, {} as Record<string, string>)

  const isEmpty = Object.keys(result).length === 0
  if (isEmpty) {
    return null
  }

  return result
}
