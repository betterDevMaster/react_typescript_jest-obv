import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import {useTemplate} from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import Question from 'Event/Question'
import {useWaiver} from 'Event/Step2/WaiverProvider'
import {useSubmissions} from 'Event/SubmissionsProvider'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Waiver from 'Event/template/SimpleBlog/Waiver'
import ProgressBar from 'lib/ui/ProgressBar'
import {registrationOnly} from 'organization/Event/QuestionsProvider'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'

export default function Step2(props: {user: User}) {
  const [submitting, setSubmitting] = useState(false)
  const {event, hasTechCheck} = useEvent()
  const {
    register,
    handleSubmit,
    errors: formErrors,
    control,
    setValue,
  } = useForm()
  const {progressBar} = useTemplate()
  const {submit: submitWaiver, canSubmit: canSubmitWaiver} = useWaiver()
  const {submit: submitAnswers, responseError, answers} = useSubmissions()

  const progress = hasTechCheck ? 50 : 67
  const questions = registrationOnly(event.questions)
  const hasQuestions = questions.length > 0

  const canSubmit = !submitting && canSubmitWaiver

  /**
   * Submitting dynamic user defined form, no way of
   * knowing the data type, so we'll have to
   * use any data here.
   */
  const submit = (data: any) => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    if (hasQuestions) {
      submitAnswers(data)
        .then(submitWaiver)
        .catch(() => {
          setSubmitting(false)
        })

      return
    }

    submitWaiver().catch(() => {
      setSubmitting(false)
    })
  }

  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit(submit)}>
          <ProgressBar
            value={progress}
            barColor={progressBar.barColor}
            textColor={progressBar.textColor}
            borderRadius={progressBar.borderRadius}
            thickness={progressBar.thickness}
          />
          {questions.map((question, index) => (
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
            />
          ))}
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
      </Container>
    </SimpleBlogPage>
  )
}
