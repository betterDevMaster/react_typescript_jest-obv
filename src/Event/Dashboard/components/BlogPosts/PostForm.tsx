import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useEvent} from 'Event/EventProvider'
import Question from 'Event/Question'
import Dialog from 'lib/ui/Dialog'
import {Form} from 'organization/Event/FormsProvider'
import React from 'react'
import {useForm} from 'react-hook-form'
import {DEFAULT_MODAL_BUTTON_TEXT} from 'Event/Dashboard/components/BlogPosts/BlogPostConfig'
import Box from '@material-ui/core/Box'
import {useAttendeeVariables} from 'Event'
import {BlogPost, FORM} from 'Event/Dashboard/components/BlogPosts'
import {usePostForm} from 'Event/Dashboard/components/BlogPosts/form'
import styled from 'styled-components'
import {
  DEFAULT_RESUBMIT_LABEL,
  DEFAULT_SUBMITTED_MESSAGE,
  DEFAULT_SUBMIT_LABEL,
} from 'organization/Event/Form'
import {useTemplate} from 'Event/TemplateProvider'

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
  const v = useAttendeeVariables()

  const {postFormStyles: formStyles} = useTemplate()

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

  const {
    register,
    handleSubmit,
    errors: formErrors,
    control,
    setValue,
  } = useForm()

  const showing = post.attachment === FORM
  if (!showing) {
    return null
  }

  if (alreadySubmitted) {
    return <SubmittedMessage resubmit={resubmit} form={form} />
  }

  const body = (
    <Container justifyContent={formStyles.position}>
      <StyledForm onSubmit={handleSubmit(submit)} width={formStyles.width}>
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
            inputStyles={formStyles.inputStyles}
          />
        ))}
        <Container justifyContent={formStyles.buttonPosition}>
          <StyledFormButton
            type="submit"
            variant="outlined"
            disabled={submitting}
            color={formStyles.buttonColor}
            backgroundColor={formStyles.buttonBackgroundColor}
            backgroundHoverColor={formStyles.buttonHoverBackgroundColor}
            raidus={formStyles.buttonRadius}
            width={formStyles.buttonSize}
          >
            {v(form.submit_label || DEFAULT_SUBMIT_LABEL)}
          </StyledFormButton>
        </Container>
      </StyledForm>
    </Container>
  )

  if (!post.isModalForm) {
    return body
  }

  return (
    <>
      <Dialog open={dialogVisible} onClose={closeDialog}>
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
    return (
      <div>{v(props.form.submitted_message || DEFAULT_SUBMITTED_MESSAGE)}</div>
    )
  }

  return (
    <div>
      <p>{v(props.form.submitted_message || DEFAULT_SUBMITTED_MESSAGE)}</p>
      <Button variant="text" onClick={props.resubmit}>
        {v(props.form.resubmit_button_label || DEFAULT_RESUBMIT_LABEL)}
      </Button>
    </div>
  )
}

const StyledForm = styled.form<{
  width: number
}>`
  width: ${(props) => props.width}%;
`

const StyledFormButton = styled((props) => {
  const {
    color,
    backgroundColor,
    backgroundHoverColor,
    raidus,
    fontSize,
    width,
    ...otherProps
  } = props
  return <Button {...otherProps} />
})<{
  color: string
  backgroundColor: string
  backgroundHoverColor: string
  radius: string
  fontSize: number
  width: number
}>`
  color: ${(props) => props.color} !important;
  cursor: pointer;
  font-size: ${(props) => props.fontSize} !important;
  border-radius: ${(props) => props.raidus}px !important;
  background-color: ${(props) => props.backgroundColor} !important;
  width: ${(props) => props.width}% !important;
  &:hover {
    background-color: ${(props) => props.backgroundHoverColor} !important;
  }
`

const Container = styled.div<{
  justifyContent: string
}>`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
`
