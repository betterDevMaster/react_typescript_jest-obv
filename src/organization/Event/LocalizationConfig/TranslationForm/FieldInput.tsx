import {Field} from 'organization/Event/LocalizationConfig/TranslationForm'
import styled from 'styled-components'
import React, {useState} from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Close from '@material-ui/icons/Close'
import {onChangeStringHandler} from 'lib/dom'
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import IconButton from 'lib/ui/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import TextEditor from 'lib/ui/form/TextEditor'

export default function FieldInput(props: {
  field: Field
  onRemove: () => void
  update: (target: Field) => void
  canUpdateKeys: boolean
  disabled?: boolean
}) {
  const {field, update, canUpdateKeys} = props
  const {value} = field
  const hasHtmlValue = /<.*>/.test(value)
  const [isHtml, setIsHtml] = useState(hasHtmlValue)

  const toggleHtmlInput = () => setIsHtml(!isHtml)

  const onChangeValue = (value: string) => {
    update({
      ...field,
      value,
    })
  }

  const onChangeKey = (key: string) => {
    update({
      ...field,
      key,
    })
  }

  const canEditKey = (field: Field) => {
    if (!canUpdateKeys) {
      return false
    }

    return field.isNew
  }

  return (
    <Box mb={2}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={3}>
          <StyledTextField
            variant="outlined"
            name={`options`}
            inputProps={{
              'aria-label': 'translation key',
            }}
            value={field.key}
            label="Key"
            fullWidth
            disabled={!canEditKey(field) || props.disabled}
            onChange={onChangeStringHandler(onChangeKey)}
          />
        </Grid>
        <Grid item xs={9}>
          <Box display="flex" alignItems="flex-start">
            <InputField
              isHtml={isHtml}
              disabled={props.disabled}
              onChangeValue={onChangeValue}
              field={field}
              onToggleHtml={toggleHtmlInput}
            />

            <RemoveButton
              onClick={props.onRemove}
              visible={canUpdateKeys}
              disabled={props.disabled}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

type InputProps = {
  isHtml: boolean
  disabled?: boolean
  onChangeValue: (value: string) => void
  field: Field
  onToggleHtml: () => void
}

function InputField(props: InputProps) {
  if (props.isHtml) {
    return <HtmlInput {...props} />
  }

  return <RegularInput {...props} />
}

function HtmlInput(props: InputProps) {
  return (
    <HtmlContainer>
      <StyledTextEditor
        data={props.field.value}
        onChange={props.onChangeValue}
        disabled={props.disabled}
      />
      <Button
        aria-label="input text"
        color="primary"
        disabled={props.disabled}
        onClick={props.onToggleHtml}
      >
        Text
      </Button>
    </HtmlContainer>
  )
}

function RegularInput(props: InputProps) {
  return (
    <StyledTextField
      disabled={props.disabled}
      variant="outlined"
      name={`options`}
      inputProps={{
        'aria-label': 'translation value',
      }}
      label="Value"
      value={props.field.value}
      fullWidth
      onChange={onChangeStringHandler(props.onChangeValue)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              aria-label="input HTML"
              color="primary"
              disabled={props.disabled}
              onClick={props.onToggleHtml}
            >
              HTML
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )
}

function RemoveButton(props: {
  onClick: () => void
  visible: boolean
  disabled?: boolean
}) {
  if (!props.visible) {
    return null
  }

  const color = props.disabled ? 'disabled' : 'error'

  return (
    <StyledIconButton
      type="button"
      aria-label="remove option"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <Close color={color} />
    </StyledIconButton>
  )
}

const StyledTextField = withStyles({
  root: {
    marginBottom: 0,
  },
})(TextField)

const StyledIconButton = styled(IconButton)`
  margin: ${(props) => `${props.theme.spacing[4]}`};
`

const StyledTextEditor = styled(TextEditor)`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing[1]};
`

const HtmlContainer = styled.div`
  width: 100%;
  text-align: right;
`
