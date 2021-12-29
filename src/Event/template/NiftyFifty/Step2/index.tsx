import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'

import MuiButton, {ButtonProps} from '@material-ui/core/Button'

import {User} from 'auth/user'

import {useAttendeeVariables} from 'Event'
import {useWaiver} from 'Event/Step2/WaiverProvider'
import Page from 'Event/template/NiftyFifty/Page'
import Waiver from 'Event/template/NiftyFifty/Step2/Waiver'
import Step2Form from 'Event/template/NiftyFifty/Step2/Step2Form'
import {useSubmissions} from 'Event/SubmissionsProvider'
import {DEFAULTS, useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import LeftPanel from 'Event/template/NiftyFifty/check-in/LeftPanel'
import RightPanel from 'Event/template/NiftyFifty/check-in/RightPanel'
import MobilePanel from 'Event/template/NiftyFifty/check-in/MobilePanel'

import {Form} from 'organization/Event/FormsProvider'

export default function Step2(props: {user: User}) {
  return (
    <Page
      Left={<LeftPanel user={props.user} />}
      Right={
        <RightPanel step={2}>
          <Content />
        </RightPanel>
      }
      Mobile={
        <MobilePanel step={2} user={props.user}>
          <Content />
        </MobilePanel>
      }
    />
  )
}

function Content() {
  const {waiver} = useWaiver()
  const {form} = waiver

  if (!form) {
    return <WaiverOnly />
  }

  return <WithForm form={form} />
}

function WithForm(props: {form: Form}) {
  const {form} = props
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    errors: formErrors,
    control,
    setValue,
  } = useForm()
  const {
    submit: submitWaiver,
    canSubmit: canSubmitWaiver,
    isPreview,
  } = useWaiver()
  const {submit: submitAnswers, responseError, answers} = useSubmissions()

  const canSubmit = !submitting && canSubmitWaiver

  /**
   * Submitting dynamic user defined form, no way of
   * knowing the data type, so we'll have to
   * use 'any' data here.
   */
  const submit = (data: any) => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    submitAnswers(form, data)
      .then(submitWaiver)
      .catch(() => {
        setSubmitting(false)
      })
  }

  const content = (
    <Container>
      <Step2Form
        form={form}
        formErrors={formErrors}
        control={control}
        register={register}
        responseError={responseError}
        setValue={setValue}
        answers={answers}
      />
      <Waiver />
      <SubmitButton canSubmit={canSubmit} />
    </Container>
  )

  if (isPreview) {
    return <div>{content}</div>
  }

  return <form onSubmit={handleSubmit(submit)}>{content}</form>
}

function WaiverOnly() {
  const [submitting, setSubmitting] = useState(false)
  const {handleSubmit} = useForm()
  const {
    submit: submitWaiver,
    canSubmit: canSubmitWaiver,
    isPreview,
  } = useWaiver()

  const canSubmit = !submitting && canSubmitWaiver

  /**
   * Submitting dynamic user defined form, no way of
   * knowing the data type, so we'll have to
   * use 'any' data here.
   */
  const submit = (data: any) => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    submitWaiver().catch(() => {
      setSubmitting(false)
    })
  }

  const body = (
    <Container>
      <Waiver />
      <SubmitButton canSubmit={canSubmit} />
    </Container>
  )

  if (isPreview) {
    return <div>{body}</div>
  }

  return <form onSubmit={handleSubmit(submit)}>{body}</form>
}

function SubmitButton(props: {canSubmit: boolean}) {
  const {waiver} = useNiftyFiftyTemplate()
  const v = useAttendeeVariables()

  const textColor = waiver?.buttonTextColor || DEFAULTS.waiver.buttonTextColor
  const backgroundColor =
    waiver?.buttonBackground || DEFAULTS.waiver.buttonBackground
  const borderColor =
    waiver?.buttonBorderColor || DEFAULTS.waiver.buttonBorderColor

  return (
    <StyledButton
      textColor={textColor}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderRadius={
        waiver?.buttonBorderRadius || DEFAULTS.waiver.buttonBorderRadius
      }
      borderWidth={
        waiver?.buttonBorderWidth || DEFAULTS.waiver.buttonBorderWidth
      }
      aria-label="submit"
      fullWidth
      disabled={!props.canSubmit}
      type="submit"
    >
      {v(waiver?.buttonText || DEFAULTS.waiver.buttonText)}
    </StyledButton>
  )
}

const StyledButton = styled(
  ({
    textColor,
    backgroundColor,
    borderRadius,
    borderColor,
    borderWidth,
    ...otherProps
  }: ButtonProps & {
    textColor: string
    backgroundColor: string
    borderRadius: number
    borderColor: string
    borderWidth: number
  }) => <MuiButton {...otherProps} />,
)`
  color: ${(props) => props.textColor}!important;
  border: ${(props) => props.borderWidth}px solid
    ${(props) => props.borderColor} !important;
  background: ${(props) => props.backgroundColor} !important;
  border-radius: ${(props) => props.borderRadius}px !important;
  margin-top: 16px !important;

  &:disabled {
    opacity: 0.6;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
