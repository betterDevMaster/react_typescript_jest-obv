import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import {onChangeStringHandler} from 'lib/dom'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useState, useEffect, useCallback, ChangeEvent} from 'react'
import {Autocomplete} from '@material-ui/lab'
import {CircularProgress} from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import {Field} from 'organization/Event/Services/Apps/Infusionsoft/Config/FieldAutocomplete'

export interface CustomFieldTab {
  id: number
  name: string
}

export default function NewLoginFieldInput(props: {
  showing: boolean
  onClose: () => void
  onAdd: (customField: Field) => void
}) {
  const {onClose, showing, onAdd} = props
  const [label, setLabel] = useState('')
  const create = useCreateField()
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const [error, setError] = useState('')
  const [customFieldTabOptions, setCustomFieldTabOptions] = useState<
    CustomFieldTab[]
  >([])
  const [
    selectedCustomFieldTab,
    setSelectedCustomFieldTab,
  ] = useState<CustomFieldTab | null>(null)
  const [customFieldsLoading, setCustomFieldsLoading] = useState<boolean>(false)
  const fetchCustomFieldTabs = useFetchCustomFieldTabs()

  const useStyles = makeStyles({
    autocompleteClass: {
      '& .MuiAutocomplete-popper': {
        marginTop: '-20px',
      },
    },
  })
  const classes = useStyles()

  useEffect(() => {
    if (showing) {
      return
    }

    // reset input
    setLabel('')

    if (processing) {
      toggleProcessing()
    }
  }, [showing, processing, toggleProcessing])

  const loadCustomFieldTabs = () => {
    setCustomFieldsLoading(true)

    fetchCustomFieldTabs()
      .then((customFieldsTabs) => {
        setCustomFieldTabOptions(customFieldsTabs)
      })
      .finally(() => {
        setCustomFieldsLoading(false)
      })
  }

  const save = () => {
    if (processing || !selectedCustomFieldTab?.id) {
      return
    }

    setError('')
    toggleProcessing()

    create(label, selectedCustomFieldTab.id)
      .then((customField) => {
        onAdd(customField)
      })
      .catch((e) => {
        setError(e.message)
        toggleProcessing()
      })
  }

  const canSave =
    !processing && Boolean(label) && Boolean(selectedCustomFieldTab)

  const onCustomFieldTabChange = (
    event: ChangeEvent<{}>,
    customFieldTab: CustomFieldTab | null,
  ) => {
    setSelectedCustomFieldTab(customFieldTab)
  }

  if (!showing) {
    return null
  }

  return (
    <div className={classes.autocompleteClass}>
      <Autocomplete
        disablePortal
        options={customFieldTabOptions}
        onChange={onCustomFieldTabChange}
        onOpen={loadCustomFieldTabs}
        getOptionLabel={(option) => (option ? option.name : '')}
        noOptionsText={'No results.'}
        closeIcon=""
        getOptionSelected={(option, value) => option.id === value.id}
        renderInput={(params) => {
          return (
            <>
              <TextField
                {...params}
                variant="outlined"
                label="Custom Field Tab"
                fullWidth
                disabled={processing}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {customFieldsLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            </>
          )
        }}
      />

      <TextField
        value={label}
        onChange={onChangeStringHandler(setLabel)}
        label="New Login Token Custom Field"
        variant="outlined"
        fullWidth
        inputProps={{
          'aria-label': 'new field name',
          maxLength: 100,
        }}
        disabled={processing}
        error={Boolean(error)}
        helperText={error}
      />
      <div>
        <SaveButton
          onClick={save}
          disabled={!canSave}
          color="primary"
          aria-label="save field"
          variant="contained"
        >
          Add custom field
        </SaveButton>
        <Button
          onClick={onClose}
          disabled={processing}
          aria-label="cancel create feild"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

function useFetchCustomFieldTabs() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {slug} = event

  return useCallback(() => {
    const url = api(
      `/events/${slug}/integrations/infusionsoft/custom_field_tabs`,
    )
    return client.get<CustomFieldTab[]>(url)
  }, [client, slug])
}

function useCreateField() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {slug} = event

  const url = api(`/events/${slug}/integrations/infusionsoft/custom_field`)
  return (label: string, tabId: number) =>
    client.post<Field>(url, {label, tab_id: tabId})
}

const SaveButton = styled(Button)`
  margin-right: ${(props) => props.theme.spacing[2]};
`
