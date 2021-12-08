import {useState} from 'react'
import {fieldErrors} from 'lib/form'
import {useForm} from 'react-hook-form'
import {Client, ValidationError} from 'lib/ui/api-client'

export interface ChangePasswordData {
  password: string
  password_confirmation: string
}

export type ChangePasswordRequest = ReturnType<typeof useChangePassword>

export function useChangePassword(client: Client, url: string) {
  const {register, handleSubmit, errors: formErrors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [wasSuccessful, setWasSuccessful] = useState(false)
  const [responseError, setResponseError] = useState<
    ValidationError<ChangePasswordData>
  >(null)
  const resetPassword = (body: ChangePasswordData) => client.patch(url, body)

  const errors = fieldErrors({
    formErrors,
    responseError,
  })

  const submit = (data: {password: string; password_confirmation: string}) => {
    setSubmitting(true)

    resetPassword(data)
      .then(() => {
        setWasSuccessful(true)
      })
      .catch((e) => {
        setResponseError(e)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const onSubmit = handleSubmit(submit)

  return {
    register,
    onSubmit,
    submitting,
    wasSuccessful,
    errors,
    responseError,
  }
}
