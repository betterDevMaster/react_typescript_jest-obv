import {fieldError} from 'lib/form'
import {useQueryParams} from 'lib/url'
import {useState} from 'react'
import {useForm, UseFormMethods} from 'react-hook-form'
import {client, ValidationError} from 'lib/api-client'

export interface ResetPasswordProps {
  onSubmit: () => void
  goBacktoLogin: () => void
  register: UseFormMethods['register']
  submitting: boolean
  wasSuccessful: boolean
  responseError: ValidationError<ResetPasswordData>
  email?: string
  errors: {
    email?: string
    password?: string
    passwordConfirmation?: string
  }
}

export interface ResetPasswordData {
  email: string
  password: string
  password_confirmation: string
}

export function useResetPassword(url: string) {
  const {register, handleSubmit, errors} = useForm()
  const [responseError, setResponseError] = useState<
    ResetPasswordProps['responseError']
  >(null)
  const [submitting, setSubmitting] = useState(false)
  const [wasSuccessful, setwasSuccessful] = useState(false)
  const {email, token} = useQueryParams()

  const resetPassword = (body: ResetPasswordData & {token?: string}) =>
    client.post(url, body)

  const submit = (data: ResetPasswordData) => {
    setSubmitting(true)
    resetPassword({token, ...data})
      .then(() => {
        setwasSuccessful(true)
      })
      .catch((e) => {
        setResponseError(e)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const onSubmit = handleSubmit(submit)

  const error = (key: keyof ResetPasswordData) =>
    fieldError(key, {
      form: errors,
      response: responseError,
    })

  return {
    onSubmit,
    register,
    errors: {
      email: error('email'),
      password: error('password'),
      passwordConfirmation: error('password_confirmation'),
    },
    responseError,
    submitting,
    wasSuccessful,
    email,
  }
}
