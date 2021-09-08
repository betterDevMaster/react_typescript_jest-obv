import {useAttendeeVariables} from 'Event'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {hasSubmittedForm, useSubmissions} from 'Event/SubmissionsProvider'
import {Form} from 'organization/Event/FormsProvider'
import {useState} from 'react'

export function usePostForm(post: BlogPost, form: Form) {
  const [submitting, setSubmitting] = useState(false)
  const [isResubmitting, setIsResubmitting] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const {submit: submitAnswers, responseError, answers} = useSubmissions()
  const v = useAttendeeVariables()

  const toggleDialog = () => setDialogVisible(!dialogVisible)

  const resubmit = () => {
    setIsResubmitting(true)

    if (post.isModalForm) {
      setDialogVisible(true)
    }
  }

  const closeDialog = () => {
    toggleDialog()

    if (isResubmitting) {
      setIsResubmitting(false)
    }
  }

  const submit = (data: any) => {
    if (submitting) {
      return
    }
    setSubmitting(true)

    submitAnswers(form, data)
      .then(() => {
        setIsResubmitting(false)

        if (form.on_submit_redirect_url) {
          window.location.href = v(form.on_submit_redirect_url)
          return
        }

        toggleDialog()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return {
    resubmit,
    submit,
    responseError,
    answers,
    dialogVisible,
    toggleDialog,
    closeDialog,
    alreadySubmitted: hasSubmittedForm(answers, form) && !isResubmitting,
    submitting,
  }
}
