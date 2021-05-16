import React, {useCallback, useEffect, useMemo, useState} from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {Translations} from 'Event/LanguageProvider/translations'
import {Language} from 'Event/LanguageProvider/language'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {v4 as uuid} from 'uuid'
import {useLanguage} from 'Event/LanguageProvider'
import FieldInput from 'organization/Event/LocalizationConfig/TranslationForm/FieldInput'
import NewFieldButton from 'organization/Event/LocalizationConfig/TranslationForm/NewFieldButton'
import Typography from '@material-ui/core/Typography'
import {useLocalizationConfig} from 'organization/Event/LocalizationConfig'

export type Field = {
  id: string
  key: string
  value: string
  isNew: boolean
}

export default function TranslationForm(props: {
  language: Language['name']
  translations: Translations
  setTranslations: (translations: Translations) => void
}) {
  const {language, translations} = props
  const {isProcessing, setIsProcessing} = useLocalizationConfig()
  const {event} = useEvent()
  const parseValues = useParseValues()
  const {languages, defaultLanguage} = useLanguage()

  const isDefaultLanguage = language === defaultLanguage

  const values = useMemo(
    () => parseValues(language, translations),
    [language, translations, parseValues],
  )

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
        translations: createTranslations({
          translations,
          language,
          languages,
          isDefault: isDefaultLanguage,
          fields,
        }),
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
        <FieldList
          fields={fields}
          disabled={isProcessing}
          update={update}
          onRemove={remove}
          canUpdateKeys={isDefaultLanguage}
        />
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
          aria-label="save translations"
          disabled={!canSave}
        >
          Save
        </Button>
      </Box>
    </>
  )
}

function FieldList(props: {
  fields: Field[]
  canUpdateKeys: boolean
  onRemove: (field: Field) => void
  disabled?: boolean
  update: (field: Field) => void
}) {
  const {fields, canUpdateKeys, update, onRemove} = props

  const empty = fields.length === 0
  if (empty) {
    return <Typography align="center">No fields have been added</Typography>
  }

  return (
    <>
      {fields.map((field: Field) => (
        <FieldInput
          key={field.id}
          field={field}
          onRemove={() => onRemove(field)}
          update={update}
          disabled={props.disabled}
          canUpdateKeys={canUpdateKeys}
        />
      ))}
    </>
  )
}

function useParseValues() {
  const parseKeys = useParseKeys()

  return useCallback(
    (language: Language['name'], translations: Translations) => {
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
  const {defaultLanguage} = useLanguage()

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

function createTranslations(attributes: {
  translations: Translations
  languages: Language[]
  language: Language['name']
  isDefault: boolean
  fields: Field[]
}) {
  const {translations, language, languages, isDefault, fields} = attributes

  const targetValues = createValues(fields)

  /**
   * If we're not saving a default language, we'll just save whatever
   * values that are filled out.
   *
   **/
  if (!isDefault || !translations) {
    return {
      ...(translations || {}),
      [language]: targetValues,
    }
  }

  return languages.reduce((acc, l) => {
    const currentLanguage = l.name
    const values = translations[currentLanguage]
    /**
     * Is default language, no need to modify keys
     */
    if (currentLanguage === language) {
      acc[language] = targetValues
      return acc
    }

    /**
     * Default language has no translations, or other language is empty,
     * we'll just set everything to empty
     */

    if (!targetValues || !values) {
      acc[currentLanguage] = null
      return acc
    }

    /**
     * Remove extra keys from other languages
     */
    acc[currentLanguage] = makeSubset(targetValues, values)

    return acc
  }, {} as Translations)
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

/**
 * Make the target a subset of the base object. Ensures that there are
 * no keys in the target that do NOT exist in base object.
 *
 * @param base
 * @param target
 * @returns
 */
function makeSubset(
  base: Record<string, string>,
  target: Record<string, string>,
) {
  return Object.entries(target).reduce((acc, [key, val]) => {
    const hasKey = Object.prototype.hasOwnProperty.call(base, key)
    if (!hasKey) {
      return acc
    }

    acc[key] = val
    return acc
  }, {} as Record<string, string>)
}
