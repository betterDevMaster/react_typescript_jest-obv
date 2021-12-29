import React, {useEffect, useRef, useState} from 'react'
import {useForm, UseFormMethods} from 'react-hook-form'

import {useEventAuth} from 'Event/auth'
import {useTemplate} from 'Event/TemplateProvider'

import SimpleBlogLogin from 'Event/template/SimpleBlog/Login'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import PanelsLogin from 'Event/template/Panels/Login'
import {PANELS} from 'Event/template/Panels'
import CardsLogin from 'Event/template/Cards/Login'
import {CARDS} from 'Event/template/Cards'
import NiftyFiftyLogin from 'Event/template/NiftyFifty/Login'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'

import {useQueryParams} from 'lib/url'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'

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

  const isProcessingToken =
    (token && !hasAttemptedTokenLogin.current) || submitting
  if (isProcessingToken) {
    return <FullPageLoader />
  }

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
    case PANELS:
      return <PanelsLogin {...props} />
    case CARDS:
      return <CardsLogin {...props} />
    case NIFTY_FIFTY:
      return <NiftyFiftyLogin {...props} />
    default:
      throw new Error(`Missing login for template`)
  }
}
