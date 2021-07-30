import FormHelperText from '@material-ui/core/FormHelperText'
import {useVariables} from 'Event'
import Checkbox from 'Event/Question/Checkbox'
import LongAnswerText from 'Event/Question/LongAnswerText'
import Radio from 'Event/Question/Radio'
import Select from 'Event/Question/Select'
import ShortAnswerText from 'Event/Question/ShortAnswerText'
import {Answer, findAnswer} from 'Event/SubmissionsProvider'
import {ValidationError} from 'lib/api-client'
import {fieldError} from 'lib/form'
import {
  CHECKBOX,
  LONG_ANSWER_TEXT,
  Question as QuestionDefinition,
  RADIO,
  SELECT,
  SHORT_ANSWER_TEXT,
} from 'organization/Event/QuestionsProvider'
import React, {useEffect} from 'react'
import {UseFormMethods} from 'react-hook-form'

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
  const v = useVariables()
  const errorWithVariables = v(error)

  const hasError = Boolean(error)

  const HelperText = (
    <FormHelperText error={hasError}>
      {error || props.question.helper_text}
    </FormHelperText>
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
