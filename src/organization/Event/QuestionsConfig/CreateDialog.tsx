import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import Form from 'organization/Event/QuestionsConfig/Form'
import {Question, useQuestions} from 'organization/Event/QuestionsProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'

export default function CreateDialog(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const create = useCreate()

  return (
    <Dialog open={props.isVisible} onClose={props.onClose}>
      <DialogTitle>Add Question</DialogTitle>
      <DialogContent>
        <Form submit={create} onClose={props.onClose} isRegistrationQuestion />
      </DialogContent>
    </Dialog>
  )
}

export interface CreateQuestionData {}

function useCreate() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const questions = useQuestions()

  return (data: CreateQuestionData) => {
    const url = api(`/events/${event.slug}/questions`)
    return client.post<Question>(url, data).then(questions.add)
  }
}
