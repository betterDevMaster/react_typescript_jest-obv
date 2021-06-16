import React, {useEffect, useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {findIcon} from 'lib/fontawesome/search'
import {withStyles} from '@material-ui/core/styles'

export default function IconSelect(props: {
  value?: string | null
  onChange: (value: string | null) => void
}) {
  const {value, onChange} = props
  const [term, setTerm] = useState('')
  const [options, setOptions] = useState<string[]>([])

  const noOptionsText = term ? 'No icon found' : 'Search for an icon...'

  useEffect(() => {
    setOptions(findIcon(term))
  }, [term])

  return (
    <StyledAutocomplete
      options={options}
      renderOption={(option) => <i className={option} />}
      blurOnSelect
      value={value || null}
      onChange={(_, value) => {
        onChange(value)
      }}
      noOptionsText={noOptionsText}
      onInputChange={(_, input) => {
        setTerm(input)
      }}
      inputValue={value ? '' : term}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Icon"
          onFocus={() => {
            /**
             * We want to 'clear' any selected icon on click, otherwise
             * we wouldn't be able to search for a new icon
             */
            onChange(null)
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: <i className={value || ''} />, // Show selected icon via adornment
          }}
        />
      )}
    />
  )
}

const StyledAutocomplete = withStyles({
  inputRoot: {
    minHeight: '34px',
  },
})(Autocomplete) as typeof Autocomplete
