import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {useEvent} from 'Event/EventProvider'
import Question, {findAnswer} from 'Event/Question'
import Dialog from 'lib/ui/Dialog'
import {Form} from 'organization/Event/FormsProvider'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {DEFAULT_MODAL_BUTTON_TEXT} from 'Event/Dashboard/components/BlogPost/BlogPostConfig'
import Box from '@material-ui/core/Box'
import {usePoints} from 'Event/PointsProvider'
import {useSubmissions} from 'Event/SubmissionsProvider'
import {useWithAttendeeData} from 'Event/auth/attendee-data'

export default function PostForm(props: {post: BlogPost}) {
  const {post} = props
  const {event} = useEvent()

  const form = event.forms.find((f) => f.id === post.formId)
  if (!form) {
    return null
  }

  return <Content form={form} post={post} />
}

function Content(props: {form: Form; post: BlogPost}) {
  const {form, post} = props
  const [submitting, setSubmitting] = useState(false)
  const [isResubmitting, setIsResubmitting] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const {submit: submitAnswers, responseError, answers} = useSubmissions()
  const {submit: submitAction} = usePoints()
  const withAttendeeData = useWithAttendeeData()

  const toggleDialog = () => setDialogVisible(!dialogVisible)

  const handleResubmit = () => {
    setIsResubmitting(true)

    if (post.isModalForm) {
      setDialogVisible(true)
    }
  }

  const handleCloseDialog = () => {
    toggleDialog()

    if (isResubmitting) {
      setIsResubmitting(false)
    }
  }

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
        setIsResubmitting(false)

        if (form.action) {
          submitAction(form.action)
        }

        if (form.on_submit_redirect_url) {
          window.location.href = withAttendeeData(form.on_submit_redirect_url)
        }
      })
      .finally(() => {
        setSubmitting(false)
        toggleDialog()
      })
  }

  const numAnswered = form.questions.filter((q) =>
    Boolean(findAnswer(q, answers)),
  ).length

  const hasSubmitted = numAnswered > 0

  if (hasSubmitted && !isResubmitting) {
    return (
      <SubmittedMessage post={post} resubmit={handleResubmit} form={form} />
    )
  }

  const body = (
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
      <div>
        <Button type="submit" variant="outlined" disabled={submitting}>
          Submit
        </Button>
      </div>
    </form>
  )

  if (!post.isModalForm) {
    return body
  }

  return (
    <>
      <Dialog open={dialogVisible} onClose={handleCloseDialog}>
        <DialogTitle>{form.name}</DialogTitle>
        <DialogContent>
          <Box pb={2}>{body}</Box>
        </DialogContent>
      </Dialog>
      <Button onClick={toggleDialog} variant="contained">
        {post.modalButtonText || DEFAULT_MODAL_BUTTON_TEXT}
      </Button>
    </>
  )
}

function SubmittedMessage(props: {
  post: BlogPost
  resubmit: () => void
  form: Form
}) {
  if (!props.form.can_resubmit) {
    return <div>{props.post.formSubmittedText}</div>
  }

  return (
    <div>
      <p>{props.post.formSubmittedText}</p>
      <Button variant="text" onClick={props.resubmit}>
        edit your answer
      </Button>
    </div>
  )
}
