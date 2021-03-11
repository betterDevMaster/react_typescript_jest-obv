import React, {useEffect, useRef, useState} from 'react'
import {useForm, UseFormMethods} from 'react-hook-form'
import {useEventAuth} from 'Event/auth'
import {useQueryParams} from 'lib/url'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import SimpleBlogLogin from 'Event/template/SimpleBlog/Login'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

export interface LoginProps {
  onSubmit: () => void
  register: UseFormMethods['register']
  errors: UseFormMethods['errors']
  error: string
  submitting: boolean
  isPreview?: boolean
}

export default function Login(props: {isPreview?: boolean}) {
  const {token} = useQueryParams()
  const {register, handleSubmit, errors} = useForm()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {login} = useEventAuth()
  const hasAttemptedTokenLogin = useRef(false)
  const {isPreview} = props

  const submit = (data: {email: string; password: string}) => {
    if (isPreview) {
      return
    }

    setSubmitting(true)
    login({
      email: data.email,
      password: data.password,
    }).catch((e) => {
      setError(e.message)
      setSubmitting(false)
    })
  }

  const onSubmit = handleSubmit(submit)

  useEffect(() => {
    if (!token || hasAttemptedTokenLogin.current || isPreview) {
      return
    }

    hasAttemptedTokenLogin.current = true
    setSubmitting(true)
    login({
      login_token: token,
    }).catch((e) => {
      setError(e.message)
      setSubmitting(false)
    })
  }, [token, login, isPreview])

  return (
    <TemplateLogin
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      error={error}
      submitting={submitting}
      isPreview={props.isPreview}
    />
  )
}

function TemplateLogin(props: LoginProps) {
  const template = useTemplate()

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogLogin {...props} />
    default:
      throw new Error(`Missing login for template: ${template.name}`)
  }
}
