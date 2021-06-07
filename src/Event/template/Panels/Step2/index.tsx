import {useWaiver} from 'Event/Step2/WaiverProvider'
import Page from 'Event/template/Panels/Page'
import Waiver from 'Event/template/Panels/Step2/Waiver'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import Step2Form from 'Event/template/Panels/Step2/Step2Form'
import {Form} from 'organization/Event/FormsProvider'
import {useSubmissions} from 'Event/SubmissionsProvider'
import styled from 'styled-components'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import {colors} from 'lib/ui/theme'
import {useVariables} from 'Event'
import {usePanels} from 'Event/template/Panels'
import LeftPanel from 'Event/template/Panels/check-in/LeftPanel'
import RightPanel from 'Event/template/Panels/check-in/RightPanel'
import MobilePanel from 'Event/template/Panels/check-in/MobilePanel'

export default function Step2() {
  return (
    <Page
      Left={<LeftPanel step={2} />}
      Right={
        <RightPanel>
          <Content />
        </RightPanel>
      }
      Mobile={
        <MobilePanel step={2}>
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
  const {template} = usePanels()
  const waiver = template.waiver
  const v = useVariables()

  const textColor = waiver?.buttonTextColor || '#FFFFFF'
  const backgroundColor = waiver?.buttonBackground || colors.primary
  const borderColor = waiver?.buttonBorderColor || colors.primary

  return (
    <StyledButton
      textColor={textColor}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderRadius={waiver?.buttonBorderRadius || 0}
      borderWidth={waiver?.buttonBorderWidth || 0}
      aria-label="submit"
      fullWidth
      disabled={!props.canSubmit}
      type="submit"
    >
      {v(waiver?.buttonText || 'Submit')}
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
  background-color: ${(props) => props.backgroundColor} !important;
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
  max-width: 400px;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    align-items: flex-start;
    max-width: inherit;
  }
`
