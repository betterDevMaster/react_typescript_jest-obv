import Question from 'Event/Question'
import {Answer} from 'Event/SubmissionsProvider'
import {ValidationError} from 'lib/ui/api-client'
import {Form} from 'organization/Event/FormsProvider'
import React from 'react'
import {UseFormMethods} from 'react-hook-form'

export default function Step2Form(props: {
  form: Form
  formErrors: UseFormMethods['errors']
  control: UseFormMethods['control']
  register: UseFormMethods['register']
  responseError: ValidationError<any>
  setValue: UseFormMethods['setValue']
  answers: Answer[]
  disabled: boolean
  inputWaiverStyles: any
}) {
  const {
    form,
    formErrors,
    control,
    register,
    responseError,
    setValue,
    answers,
    disabled,
    inputWaiverStyles,
  } = props

  return (
    <>
      {form.questions.map((question, index) => (
        <Question
          formErrors={formErrors}
          key={question.id}
          index={index}
          control={control}
          question={question}
          answers={answers}
          register={register}
          responseError={responseError}
          setValue={setValue}
          disabled={disabled}
          inputStyles={inputWaiverStyles}
        />
      ))}
    </>
  )
}
