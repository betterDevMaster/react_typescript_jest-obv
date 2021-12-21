import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import {handleAutocomplete, onChangeStringHandler} from 'lib/dom'
import {Autocomplete} from '@material-ui/lab'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {ajax, useObserve} from 'lib/rx'
import {debounceTime, filter, map, switchMap, tap} from 'rxjs/operators'
import {useAuthToken} from 'obvio/auth'

/**
 * For any Infusionsoft default fields, we'll assign a special label
 * to differentiate between custom fields. This is set from the
 * API.
 */
const DEFAULT_FIELD_LABEL = 'default_field'

/**
 * Minimum amount of chars required to perform a search.
 */
const MIN_SEARCH_CHARS = 3

export interface Field {
  label: string
  name: string
}

export default function FieldAutoComplete(props: {
  value: Field | null
  onChange: (field: Field | null) => void
  label?: string
  disabled?: boolean
  errorText?: string | null
}) {
  const {value: selected, onChange} = props

  const [options, setOptions] = React.useState<Field[]>([])
  const [loading, setLoading] = React.useState(false)
  const [name, setName] = useState('')
  const token = useAuthToken()
  const {
    event: {slug},
  } = useEvent()

  const {value$, onReady} = useObserve(name)

  // Set up search pipeline
  useEffect(() => {
    if (!onReady) {
      return
    }

    value$
      .pipe(
        filter((value) => {
          return value.length >= MIN_SEARCH_CHARS
        }),
        tap(() => {
          setLoading(true)
        }),
        debounceTime(500),
        switchMap((name) => {
          const url = api(
            `/events/${slug}/integrations/infusionsoft/fields?name=${name}`,
          )

          return ajax.get(url, {
            accessToken: token,
          })
        }),
        map((res: any) => {
          return res.response
        }),
        tap(() => {
          setLoading(false)
        }),
      )
      .subscribe({
        next: setOptions,
      })

    onReady()
  }, [value$, token, slug, onReady])

  const optionLabel = (field: Field | null) => {
    console.log('FIELD: ', field)
    if (!field || !field.label) {
      return ''
    }

    if (field.label === DEFAULT_FIELD_LABEL) {
      return field.name || ''
    }

    if (field.name) {
      return field.label + ' - ' + field.name
    }

    return field.label
  }

  const isBelowMinSearch = name.length < MIN_SEARCH_CHARS

  const noOptionsText = () => {
    if (loading) {
      return 'Loading...'
    }

    if (isBelowMinSearch) {
      return `Type to search. Minimum length: ${MIN_SEARCH_CHARS} characters.`
    }

    return `Could not find a field containing '${name}'`
  }

  return (
    <Box>
      <Autocomplete
        disablePortal
        options={options}
        value={selected}
        aria-label={'field autocomplete'}
        onChange={handleAutocomplete(onChange)}
        getOptionLabel={optionLabel}
        loading={loading}
        closeIcon=""
        noOptionsText={noOptionsText()}
        getOptionSelected={(option, value) => option.name === value.name}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              onChange={onChangeStringHandler(setName)}
              variant="outlined"
              label={props.label || 'Field'}
              fullWidth
              helperText={props.errorText || ''}
              error={Boolean(props.errorText)}
              inputProps={{
                ...params.inputProps,
                'aria-label': 'field search',
              }}
              InputProps={{
                ...params.InputProps,
              }}
            />
          )
        }}
      />
    </Box>
  )
}

const Box = styled.div`
  position: relative;
  .MuiAutocomplete-popper {
    margin-top: -20px !important;
  }
`
