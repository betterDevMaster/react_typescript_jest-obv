import {fieldError} from 'lib/form'
import {useState} from 'react'
import {useForm, UseFormMethods} from 'react-hook-form'
import {client, ValidationError} from 'lib/api-client'

export interface ForgotPasswordData {
  email: string
  form_url: string
}

export interface ForgotPasswordProps {
  onSubmit: () => void
  register: UseFormMethods['register']
  submitting: boolean
  resetLinkSent: boolean
  responseError: ValidationError<ForgotPasswordData>
  emailError?: string
}

export function useForgotPassword(props: {
  url: string
  resetFormUrl: string
}): ForgotPasswordProps {
  const {register, handleSubmit, errors} = useForm()
  const [responseError, setResponseError] =
    useState<ValidationError<{email: string}>>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resetLinkSent, setResetLinkSent] = useState(false)

  const forgotPassword = (body: {email: string; form_url: string}) =>
    client.post(props.url, body)

  const emailError = fieldError('email', {
    form: errors,
    response: responseError,
  })

  const submit = (data: {email: string}) => {
    setSubmitting(true)
    forgotPassword({
      email: data.email,
      form_url: props.resetFormUrl,
    })
      .then(() => {
        setResetLinkSent(true)
      })
      .catch(setResponseError)
      .finally(() => {
        setSubmitting(false)
      })
  }

  return {
    submitting,
    resetLinkSent,
    register,
    emailError,
    responseError,
    onSubmit: handleSubmit(submit),
  }
}
