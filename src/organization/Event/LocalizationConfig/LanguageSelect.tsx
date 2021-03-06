import React from 'react'
import {onUnknownChangeHandler} from 'lib/dom'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {Language} from 'Event/LanguageProvider/language'
import {useLanguage} from 'Event/LanguageProvider'

export default function LanguageSelect(props: {
  value: Language['name']
  onChange: (language: Language['name']) => void
  showDefault?: boolean
  disabled?: boolean
}) {
  const {languages, defaultLanguage} = useLanguage()

  const label = (language: Language) => {
    const isDefault = language.name === defaultLanguage
    if (!props.showDefault || !isDefault) {
      return language.name
    }

    return `${language.name} (Default)`
  }

  const sortedByDefault = [...languages].sort((a, _) => {
    if (a.name === defaultLanguage) {
      return -1
    }

    return 0
  })

  const optionExists = sortedByDefault.map((l) => l.name).includes(props.value)
  const value = optionExists ? props.value : defaultLanguage

  return (
    <FormControl fullWidth>
      <Select
        variant="outlined"
        onChange={onUnknownChangeHandler(props.onChange)}
        value={value}
        disabled={props.disabled}
        inputProps={{
          'aria-label': 'language select',
        }}
      >
        {sortedByDefault.map((language: Language, index: number) => (
          <MenuItem
            key={index}
            value={language.name}
            aria-label={language.name}
          >
            {label(language)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
