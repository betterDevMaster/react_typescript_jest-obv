import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useEvent} from 'Event/EventProvider'
import Question from 'Event/Question'
import Dialog from 'lib/ui/Dialog'
import {Form} from 'organization/Event/FormsProvider'
import React from 'react'
import {useForm} from 'react-hook-form'
import {DEFAULT_MODAL_BUTTON_TEXT} from 'Event/Dashboard/components/BlogPost/BlogPostConfig'
import Box from '@material-ui/core/Box'
import {useAttendeeVariables} from 'Event'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {usePostForm} from 'Event/Dashboard/components/BlogPost/form'

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

  const {
    toggleDialog,
    dialogVisible,
    resubmit,
    alreadySubmitted,
    submit,
    answers,
    responseError,
    submitting,
    closeDialog,
  } = usePostForm(post, form)

  const v = useAttendeeVariables()

  const {
    register,
    handleSubmit,
    errors: formErrors,
    control,
    setValue,
  } = useForm()

  if (alreadySubmitted) {
    return <SubmittedMessage resubmit={resubmit} form={form} />
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
          {v(form.submit_label)}
        </Button>
      </div>
    </form>
  )

  if (!post.isModalForm) {
    return body
  }

  return (
    <>
      <Dialog
        open={dialogVisible}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
      >
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

function SubmittedMessage(props: {resubmit: () => void; form: Form}) {
  const v = useAttendeeVariables()

  if (!props.form.can_resubmit) {
    return <div>{v(props.form.submitted_message)}</div>
  }

  return (
    <div>
      <p>{v(props.form.submitted_message)}</p>
      <Button variant="text" onClick={props.resubmit}>
        {v(props.form.resubmit_button_label)}
      </Button>
    </div>
  )
}
