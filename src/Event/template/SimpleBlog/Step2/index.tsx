import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import {useWaiver} from 'Event/Step2/WaiverProvider'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Waiver from 'Event/template/SimpleBlog/Step2/Waiver'
import ProgressBar from 'lib/ui/ProgressBar'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import Step2Form from 'Event/template/SimpleBlog/Step2/Step2Form'
import {Form} from 'organization/Event/FormsProvider'
import {useSubmissions} from 'Event/SubmissionsProvider'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {colors} from 'lib/ui/theme'
import {useAttendeeVariables} from 'Event'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'

export default function Step2(props: {user: User}) {
  const {progressBar} = useSimpleBlogTemplate()

  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="md">
        <ProgressBar
          showing={progressBar.showing}
          text={progressBar.step2Text}
          value={progressBar.step2Percent}
          barColor={progressBar.barColor}
          backgroundColor={progressBar.backgroundColor}
          textColor={progressBar.textColor}
          borderRadius={progressBar.borderRadius}
          thickness={progressBar.thickness}
          checkInTitle=""
          checkInColor="#000000"
        />
        <Content />
      </Container>
    </SimpleBlogPage>
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
    <>
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
      <Box display="flex" justifyContent="center" m={1}>
        <SubmitButton canSubmit={canSubmit} {...props} />
      </Box>
    </>
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
  const {waiver} = useSimpleBlogTemplate()

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
    <>
      <Waiver />
      <Center>
        <Grid item xs={waiver?.buttonWidth}>
          <SubmitButton canSubmit={canSubmit} />
        </Grid>
      </Center>
    </>
  )

  if (isPreview) {
    return <div>{body}</div>
  }

  return <form onSubmit={handleSubmit(submit)}>{body}</form>
}

function SubmitButton(props: {canSubmit: boolean}) {
  const {waiver} = useSimpleBlogTemplate()
  const v = useAttendeeVariables()

  const textColor = waiver?.buttonTextColor || '#FFFFFF'
  const backgroundColor = waiver?.buttonBackground || colors.primary
  const backgroundHoverColor = waiver?.buttonHoverBackground || colors.primary
  const borderColor = waiver?.buttonBorderColor || colors.primary

  return (
    <StyledButton
      textColor={textColor}
      backgroundColor={backgroundColor}
      backgroundHoverColor={backgroundHoverColor}
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
    backgroundHoverColor,
    borderRadius,
    borderColor,
    borderWidth,
    ...otherProps
  }: ButtonProps & {
    textColor: string
    backgroundColor: string
    backgroundHoverColor: string
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
  &:hover {
    background: ${(props) => props.backgroundHoverColor} !important;
  }
  &:disabled {
    opacity: 0.6;
  }
`
const Center = styled.div`
  display: flex;
  justify-content: center;
`
