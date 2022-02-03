import styled from 'styled-components'
import React, {ReactNode, useEffect, useState} from 'react'
import TextField from '@material-ui/core/TextField'
import {handleAutocomplete, onChangeStringHandler} from 'lib/dom'
import {Autocomplete} from '@material-ui/lab'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {InfusionsoftTag} from 'Event/infusionsoft'
import {ajax, useObserve} from 'lib/rx'
import {debounceTime, filter, map, switchMap, tap} from 'rxjs/operators'
import {useAuthToken} from 'obvio/auth'

/**
 * Minimum amount of chars required to perform a search.
 */
const MIN_SEARCH_CHARS = 3

export default function TagsAutocomplete(props: {
  value?: InfusionsoftTag | null
  onChange: (infusionSoftTag: InfusionsoftTag | null) => void
  inputLabel?: string
  inputVariant?: 'filled' | 'standard' | 'outlined' | undefined
  saveButtonText?: string
  disabled?: boolean
  errorText?: string
  endAdornment?: (loading: boolean, arrow: ReactNode) => JSX.Element
}) {
  const {endAdornment, value, onChange} = props
  const [name, setName] = useState('')
  const {value$, onReady} = useObserve(name)
  const [options, setOptions] = React.useState<InfusionsoftTag[]>([])
  const [loading, setLoading] = React.useState(false)

  const {
    event: {slug},
  } = useEvent()
  const token = useAuthToken()

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
            `/events/${slug}/integrations/infusionsoft/tags?name=${name}`,
          )

          return ajax.get(url, {
            accessToken: token,
          })
        }),
        map((res) => res.response),
        tap(() => {
          setLoading(false)
        }),
      )
      .subscribe({
        next: setOptions,
      })

    onReady()
  }, [value$, token, slug, onReady])

  return (
    <Box>
      <Autocomplete
        disablePortal
        options={options}
        value={value || null}
        onChange={handleAutocomplete(onChange)}
        getOptionLabel={(option) => (option ? option.name : '')}
        loading={loading}
        closeIcon=""
        aria-label={'tag id holder'}
        noOptionsText={'Type to search. Minimum length: 3 characters.'}
        getOptionSelected={(option, value) => option.id === value.id}
        renderInput={(params) => {
          return (
            <>
              <TextField
                {...params}
                onChange={onChangeStringHandler(setName)}
                variant={props.inputVariant ? props.inputVariant : 'standard'}
                fullWidth
                helperText={props.errorText ? props.errorText : ''}
                error={Boolean(props.errorText)}
                label={props.inputLabel ? props.inputLabel : 'Infusionsoft Tag'}
                inputProps={{
                  ...params.inputProps,
                  'aria-label': 'tag id',
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: endAdornment ? (
                    endAdornment(loading, params.InputProps.endAdornment)
                  ) : (
                    <></>
                  ),
                }}
              />
            </>
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
