import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import Question from 'Event/Question'
import Dialog from 'lib/ui/Dialog'
import {Form} from 'organization/Event/FormsProvider'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import Box from '@material-ui/core/Box'
import {hasSubmittedForm, useSubmissions} from 'Event/SubmissionsProvider'
import {Sponsor} from 'Event/SponsorPage'
import {useAttendeeVariables} from 'Event'

export default function SponsorForm(props: {
  sponsor: Sponsor
  isEditMode?: boolean
  visible: boolean
  onClose: () => void
}) {
  const {
    sponsor: {form},
  } = props

  if (props.isEditMode) {
    return null
  }

  if (!form) {
    return null
  }

  return <Content form={form} visible={props.visible} onClose={props.onClose} />
}

function Content(props: {form: Form; visible: boolean; onClose: () => void}) {
  const {form, onClose, visible} = props

  return (
    <>
      <Dialog open={visible} onClose={onClose}>
        <DialogTitle>{form.name}</DialogTitle>
        <DialogContent>
          <Box pb={2}>
            <Body form={form} onSubmitted={onClose} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Body(props: {form: Form; onSubmitted: () => void}) {
  const {form} = props
  const {submit: submitAnswers, responseError, answers} = useSubmissions()
  const [submitting, setSubmitting] = useState(false)
  const v = useAttendeeVariables()
  const [isResubmitting, setIsResubmitting] = useState(false)

  const toggleResubmit = () => setIsResubmitting(!isResubmitting)

  const {
    register,
    handleSubmit,
    errors: formErrors,
    control,
    setValue,
  } = useForm()

  const submit = (data: any) => {
    if (submitting) {
      return
    }
    setSubmitting(true)

    submitAnswers(form, data)
      .then(() => {
        if (form.on_submit_redirect_url) {
          window.location.href = v(form.on_submit_redirect_url)
        }

        props.onSubmitted()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  if (hasSubmittedForm(answers, form) && !isResubmitting) {
    return <SubmittedMessage form={form} onResubmit={toggleResubmit} />
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
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
          disabled={submitting}
        />
      ))}
      <Button type="submit" variant="outlined" disabled={submitting} fullWidth>
        {v(form.submit_label)}
      </Button>
    </form>
  )
}

function SubmittedMessage(props: {form: Form; onResubmit: () => void}) {
  const v = useAttendeeVariables()
  const {form, onResubmit} = props

  if (!form.can_resubmit) {
    return (
      <div>
        <p>{v(props.form.submitted_message)}</p>
      </div>
    )
  }

  return (
    <div>
      <p>{v(props.form.submitted_message)}</p>
      <Button variant="text" onClick={onResubmit}>
        {v(props.form.resubmit_button_label)}
      </Button>
    </div>
  )
}
