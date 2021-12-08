import FormHelperText from '@material-ui/core/FormHelperText'
import {useAttendeeVariables} from 'Event'
import Checkbox from 'Event/Question/Checkbox'
import LongAnswerText from 'Event/Question/LongAnswerText'
import Price from 'Event/Question/Currency'
import Radio from 'Event/Question/Radio'
import Select from 'Event/Question/Select'
import ShortAnswerText from 'Event/Question/ShortAnswerText'
import {Answer, findAnswer} from 'Event/SubmissionsProvider'
import {ValidationError} from 'lib/ui/api-client'
import {fieldError} from 'lib/form'
import {
  CHECKBOX,
  LONG_ANSWER_TEXT,
  CURRENCY,
  Question as QuestionDefinition,
  RADIO,
  SELECT,
  SHORT_ANSWER_TEXT,
} from 'organization/Event/QuestionsProvider'
import React, {useEffect} from 'react'
import {UseFormMethods} from 'react-hook-form'
import styled from 'styled-components'
import {makeStyles} from '@material-ui/core/styles'
import {rgba} from 'lib/color'
import TextField, {TextFieldProps} from '@material-ui/core/TextField'

export interface InputStyles {
  labelColor?: string
  borderColor?: string
  backgroundColor?: string
  backgroundOpacity?: number
  textColor?: string
  helperTextColor?: string
}

export interface QuestionProps {
  index: number
  question: QuestionDefinition
  register?: UseFormMethods['register']
  control?: UseFormMethods['control']
  formErrors?: UseFormMethods['errors']
  setValue?: UseFormMethods['setValue']
  responseError?: ValidationError<any>
  answers?: Answer[]
  disabled?: boolean
  inputStyles?: InputStyles
}

export type FieldProps = QuestionProps & {
  name: string
  error?: string
  hasError: boolean
  HelperText: React.ReactElement
  answer: string | null
}

export default function Question(props: QuestionProps) {
  const name = `answers[${props.index}].question_id`
  const errorKey = `answers[${props.index}].value`
  const error = fieldError(errorKey, {
    form: props.formErrors || {},
    response: props.responseError || null,
  })
  const v = useAttendeeVariables()
  const errorWithVariables = v(error)

  const hasError = Boolean(error)
  const {inputStyles: questionFormStyle} = props

  const HelperText = (
    <StyledFormHelperText
      error={hasError}
      color={questionFormStyle?.helperTextColor}
    >
      {v(error || props.question.helper_text || '')}
    </StyledFormHelperText>
  )

  const answer = findAnswer(props.question, props.answers)

  return (
    <>
      <input
        type="hidden"
        name={name}
        value={props.question.id}
        ref={props.register}
      />
      <Field
        {...props}
        name={`answers[${props.index}].value`}
        error={errorWithVariables}
        hasError={hasError}
        HelperText={HelperText}
        answer={answer}
        disabled={props.disabled}
      />
    </>
  )
}

function Field(props: FieldProps) {
  switch (props.question.type) {
    case SHORT_ANSWER_TEXT:
      return <ShortAnswerText {...props} />
    case LONG_ANSWER_TEXT:
      return <LongAnswerText {...props} />
    case RADIO:
      return <Radio {...props} />
    case SELECT:
      return <Select {...props} />
    case CHECKBOX:
      return <Checkbox {...props} />
    case CURRENCY:
      return <Price {...props} />
    default:
      throw new Error(
        `Missing question component for type: ${props.question.type}`,
      )
  }
}

export function useSavedValue(props: {
  setValue?: UseFormMethods['setValue']
  name: string
  answer: string | null
}) {
  const {setValue, answer, name} = props
  useEffect(() => {
    if (!setValue || !answer) {
      return
    }

    setValue(name, answer)
  }, [setValue, answer, name])
}

const StyledFormHelperText = styled((props) => {
  const {color, ...otherProps} = props
  return <FormHelperText {...otherProps} />
})`
  color: ${(props) => props.color} !important;
`

export function FormTextField(
  props: TextFieldProps & {
    styles?: InputStyles
    startAdornment?: JSX.Element
  },
) {
  const useStyles = makeStyles({
    root: {
      backgroundColor: rgba(
        props.styles?.backgroundColor || '#ffffff',
        (props.styles?.backgroundOpacity || 0) / 100,
      ),
      color: props.styles?.textColor,
    },
    labelRoot: {
      color: props.styles?.labelColor,
      zIndex: 2, // prevent background from hiding label
      '&$labelFocused': {
        color: props.styles?.labelColor,
      },
    },
    underline: {
      borderBottom: `1px solid ${props.styles?.borderColor}`,
      '&::after': {
        borderBottom: `1px solid ${props.styles?.borderColor}`,
      },
    },
    helper: {
      color: props.styles?.helperTextColor,
    },
    labelFocused: {},
  })

  const classes = useStyles()

  return (
    <TextField
      InputProps={{
        classes: {
          root: classes.root,
          underline: classes.underline,
        },
        startAdornment: props.startAdornment,
      }}
      InputLabelProps={{
        classes: {
          root: classes.labelRoot,
          focused: classes.labelFocused,
        },
      }}
      FormHelperTextProps={{
        className: classes.helper,
      }}
      {...props}
    />
  )
}
