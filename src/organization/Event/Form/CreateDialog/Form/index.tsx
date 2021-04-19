import {TextField, withStyles} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import {ValidationError} from 'lib/api-client'
import {onUnknownChangeHandler} from 'lib/dom'
import {fieldError} from 'lib/form'
import {spacing} from 'lib/ui/theme'
import AllowsMultipleSwitch from 'organization/Event/Form/CreateDialog/Form/AllowsMultipleSwitch'
import OptionsInput from 'organization/Event/Form/CreateDialog/Form/OptionsInput'
import {
  ALPHA_NUMERIC,
  CHECKBOX,
  EMAIL,
  LONG_ANSWER_TEXT,
  NUMERIC,
  PHONE_NUMBER,
  Question,
  RADIO,
  SELECT,
  SHORT_ANSWER_TEXT,
} from 'organization/Event/QuestionsProvider'
import React, {useEffect, useRef, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'

const TYPE_SELECT_ID = 'question-type-select'
const RULE_SELECT_ID = 'question-rule-select'

export default function Form(props: {
  submit: (data: Partial<Question>) => Promise<void>
  onClose: () => void
  question?: Question
  footer?: React.ReactElement
}) {
  const {register, handleSubmit, errors, control, watch, setValue} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setReponseError] = useState<
    ValidationError<Partial<Question>>
  >(null)
  const isMounted = useRef(true)
  const {question} = props

  const selectedType = watch('type')

  useEffect(() => {
    if (!question) {
      return
    }

    setValue('type', question.type)
    setValue('is_required', question.is_required)
  }, [question, setValue])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const submit = (input: Partial<Question>) => {
    if (submitting) {
      return
    }

    setReponseError(null)
    setSubmitting(true)

    const data: Partial<Question> = {
      ...input,
    }

    props
      .submit(data)
      .then(props.onClose)
      .catch(setReponseError)
      .finally(() => {
        if (isMounted.current) {
          setSubmitting(false)
        }
      })
  }

  const error = (field: keyof Question) => {
    const value = fieldError(field, {
      form: errors,
      response: responseError,
    })

    return {
      exists: Boolean(value),
      value,
    }
  }

  return (
    <Box pb={3}>
      <form onSubmit={handleSubmit(submit)}>
        <TextField
          label="Label"
          fullWidth
          variant="outlined"
          required
          name="label"
          defaultValue={question?.label || ''}
          inputProps={{
            ref: register({required: 'Label is required'}),
            'aria-label': 'question label',
          }}
          error={error('label').exists}
          helperText={error('label').value}
        />
        <FormControl fullWidth disabled={submitting}>
          <StyledInputLabel
            htmlFor={TYPE_SELECT_ID}
            required
            variant="outlined"
            filled
          >
            Type
          </StyledInputLabel>
          <Controller
            name="type"
            defaultValue={question?.type || ''}
            control={control}
            render={({onChange, value}) => (
              <Select
                id={TYPE_SELECT_ID}
                value={value}
                fullWidth
                onChange={onUnknownChangeHandler(onChange)}
                variant="outlined"
                inputProps={{
                  'aria-label': 'question type',
                }}
              >
                <MenuItem value={SHORT_ANSWER_TEXT}>Short Answer Text</MenuItem>
                <MenuItem value={LONG_ANSWER_TEXT}>Long Answer Text</MenuItem>
                <MenuItem value={RADIO}>Radio</MenuItem>
                <MenuItem value={SELECT}>Select</MenuItem>
                <MenuItem value={CHECKBOX}>Checkbox</MenuItem>
              </Select>
            )}
          />
        </FormControl>
        <AllowsMultipleSwitch
          control={control}
          questionType={selectedType}
          register={register}
          question={question}
          submitting={submitting}
        />
        <OptionsInput
          questionType={selectedType}
          register={register}
          question={question}
          submitting={submitting}
        />
        <TextField
          label="Helper Text"
          fullWidth
          variant="outlined"
          name="helper_text"
          defaultValue={question?.helper_text || ''}
          inputProps={{
            ref: register,
            'aria-label': 'helper text',
          }}
          multiline
          rows={4}
          error={error('helper_text').exists}
          helperText={error('helper_text').value}
        />
        <FormControl fullWidth disabled={submitting}>
          <StyledInputLabel htmlFor={RULE_SELECT_ID} variant="outlined" filled>
            Validation
          </StyledInputLabel>
          <Controller
            name="validation_rule"
            defaultValue={question?.validation_rule || null}
            control={control}
            render={({onChange, value}) => (
              <Select
                id={RULE_SELECT_ID}
                value={value || 0}
                fullWidth
                onChange={onUnknownChangeHandler((val) =>
                  onChange(val || null),
                )}
                variant="outlined"
                inputProps={{
                  'aria-label': 'validation rule',
                }}
              >
                <MenuItem value={0}>None</MenuItem>
                <MenuItem value={EMAIL} aria-label="email">
                  Email
                </MenuItem>
                <MenuItem value={PHONE_NUMBER} aria-label="phone number">
                  Phone Number
                </MenuItem>
                <MenuItem value={ALPHA_NUMERIC} aria-label="alpha numeric">
                  Alphanumeric
                </MenuItem>
                <MenuItem value={NUMERIC} aria-label="number">
                  Number
                </MenuItem>
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth disabled={submitting}>
          <FormControlLabel
            control={
              <Controller
                name="is_required"
                defaultValue={question?.is_required || true}
                control={control}
                render={({onChange, value}) => (
                  <Switch
                    checked={!value}
                    onChange={(e) => onChange(!e.target.checked)}
                    inputProps={{'aria-label': 'is optional'}}
                  />
                )}
              />
            }
            label="Optional"
          />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={submitting}
          type="submit"
          aria-label="save"
        >
          Save
        </Button>
        <ResponseError>{responseError}</ResponseError>
      </form>
      {props.footer || null}
    </Box>
  )
}

function ResponseError(props: {children: ValidationError<Question> | null}) {
  if (!props.children) {
    return null
  }

  return (
    <ErrorText color="error" align="center">
      {props.children.message}
    </ErrorText>
  )
}

const ErrorText = withStyles({
  root: {
    marginY: spacing[3],
  },
})(Typography)

export function ruleLabel(name: string) {
  const labels: Record<string, string> = {
    email: 'Email',
    phone_number: 'Phone Number',
    alpha_numeric: 'Alphanumeric',
    numeric: 'Number',
  }

  const label = labels[name]
  if (!label) {
    throw new Error(`Label not defined for rule: ${name}`)
  }

  return label
}

const StyledInputLabel = withStyles({
  root: {
    background: '#FFFFFF',
  },
})(InputLabel)
