import React from 'react'
import {onUnknownChangeHandler} from 'lib/dom'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {Language, ALL_LANGUAGES} from 'Event/LanguageProvider/language'
import {useDefaultLanguage} from 'Event/LanguageProvider'

export default function LanguageSelect(props: {
  value: Language
  onChange: (language: Language) => void
  showDefault?: boolean
  disabled?: boolean
}) {
  const defaultLanguage = useDefaultLanguage()

  const label = (language: Language) => {
    const isDefault = language === defaultLanguage
    if (!props.showDefault || !isDefault) {
      return language
    }

    return `${language} (Default)`
  }

  const sortedByDefault = [...ALL_LANGUAGES].sort((a, b) => {
    if (a === defaultLanguage) {
      return -1
    }

    return 0
  })

  return (
    <FormControl fullWidth>
      <Select
        variant="outlined"
        onChange={onUnknownChangeHandler(props.onChange)}
        value={props.value}
        disabled={props.disabled}
      >
        {sortedByDefault.map((language: Language, index: number) => (
          <MenuItem key={index} value={language}>
            {label(language)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
