import TextField from '@material-ui/core/TextField'
import withStyles from '@material-ui/core/styles/withStyles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import {onUnknownChangeHandler} from 'lib/dom'
import {fieldError} from 'lib/form'
import AllowsMultipleSwitch from 'organization/Event/Form/dialog/Form/AllowsMultipleSwitch'
import HasOtherOptionSwitch from 'organization/Event/Form/dialog/Form/HasOtherOptionSwitch'
import OptionsInput from 'organization/Event/Form/dialog/Form/OptionsInput'
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
import React, {useEffect} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {v4 as uuid} from 'uuid'

const TYPE_SELECT_ID = 'question-type-select'
const RULE_SELECT_ID = 'question-rule-select'

export default function Form(props: {
  onComplete: (data: Question) => void
  onClose: () => void
  question?: Question
  footer?: React.ReactElement
}) {
  const {question} = props
  const {register, handleSubmit, errors, control, watch, setValue} = useForm({
    defaultValues: {
      options: question?.options || [],
      type: question?.type || '',
    },
  })

  const selectedType = watch('type')

  useEffect(() => {
    if (!question) {
      return
    }

    setValue('type', question.type)
    setValue('is_required', question.is_required)
  }, [question, setValue])

  const submit = (data: Question) => {
    const withDefaults = {
      ...data,
      options: data.options || [],
      id: question?.id || uuid(),
    }

    props.onComplete(withDefaults)
    props.onClose()
  }

  const error = (field: keyof Question) => {
    const value = fieldError(field, {
      form: errors,
      response: null,
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
        <FormControl fullWidth>
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
                required
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
        />
        <HasOtherOptionSwitch
          control={control}
          questionType={selectedType}
          register={register}
          question={question}
        />
        <OptionsInput
          questionType={selectedType}
          control={control}
          register={register}
          question={question}
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
        <FormControl fullWidth>
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
        <FormControl fullWidth>
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
          type="submit"
          aria-label="save"
        >
          Save
        </Button>
      </form>
      {props.footer || null}
    </Box>
  )
}

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
