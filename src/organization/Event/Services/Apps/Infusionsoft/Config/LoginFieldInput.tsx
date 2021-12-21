import Button, {ButtonProps} from '@material-ui/core/Button'
import React from 'react'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import {useToggle} from 'lib/toggle'
import NewLoginFieldInput from 'organization/Event/Services/Apps/Infusionsoft/Config/NewLoginFieldInput.tsx'
import FieldAutoComplete, {
  Field,
} from 'organization/Event/Services/Apps/Infusionsoft/Config/FieldAutocomplete'

export default function LoginFieldInput(props: {
  value: Field | null
  onChange: (field: Field | null) => void
  errorText?: string | null
}) {
  const {value, onChange} = props
  const {flag: showingNewFieldInput, toggle: toggleNewFieldInput} = useToggle()

  const handleNewField = (field: Field) => {
    onChange(field)
    toggleNewFieldInput()
  }

  return (
    <Box mb={4}>
      <ExistingFieldSelect showing={!showingNewFieldInput}>
        <FieldAutoComplete
          value={value}
          onChange={onChange}
          label="Login Token Field"
          errorText={props.errorText}
        />
      </ExistingFieldSelect>
      <NewLoginFieldInput
        showing={showingNewFieldInput}
        onClose={toggleNewFieldInput}
        onAdd={handleNewField}
      />
      <CreateFieldButton
        showing={!showingNewFieldInput}
        onClick={toggleNewFieldInput}
        aria-label="create new field"
        color="primary"
        variant="outlined"
      >
        Create New Field
      </CreateFieldButton>
    </Box>
  )
}

const ExistingFieldSelect = styled.div<{showing: boolean}>`
  display: ${(props) => (props.showing ? 'block' : 'none')};
`

const CreateFieldButton = styled((props: {showing: boolean} & ButtonProps) => {
  const {showing, ...otherProps} = props
  return <Button {...otherProps} />
})`
  display: ${(props) => (props.showing ? 'inline-flex' : 'none')};
`
