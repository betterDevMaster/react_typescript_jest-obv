import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import {useTemplate} from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {useWaiver} from 'Event/Step2/WaiverProvider'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Waiver from 'Event/template/SimpleBlog/Waiver'
import ProgressBar from 'lib/ui/ProgressBar'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import Step2Form from 'Event/template/SimpleBlog/Step2/Step2Form'
import {Form} from 'organization/Event/FormsProvider'
import {useSubmissions} from 'Event/SubmissionsProvider'

export default function Step2(props: {user: User}) {
  const {progressBar} = useTemplate()
  const {hasTechCheck} = useEvent()
  const progress = hasTechCheck ? 50 : 67

  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="sm">
        <ProgressBar
          value={progress}
          barColor={progressBar.barColor}
          textColor={progressBar.textColor}
          borderRadius={progressBar.borderRadius}
          thickness={progressBar.thickness}
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
  const {submit: submitWaiver, canSubmit: canSubmitWaiver} = useWaiver()
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

  return (
    <form onSubmit={handleSubmit(submit)}>
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
      <div>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          disabled={!canSubmit}
          aria-label="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  )
}

function WaiverOnly() {
  const [submitting, setSubmitting] = useState(false)
  const {handleSubmit} = useForm()
  const {submit: submitWaiver, canSubmit: canSubmitWaiver} = useWaiver()

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

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Waiver />
      <div>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          disabled={!canSubmit}
          aria-label="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
