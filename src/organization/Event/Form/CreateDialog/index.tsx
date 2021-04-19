import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {api} from 'lib/url'
import Form from 'organization/Event/Form/CreateDialog/Form'
import {useForm} from 'organization/Event/Form/FormProvider'
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
        <Form submit={create} onClose={props.onClose} />
      </DialogContent>
    </Dialog>
  )
}

export interface CreateQuestionData {}

function useCreate() {
  const {client} = useOrganization()
  const questions = useQuestions()
  const {form} = useForm()

  return (data: CreateQuestionData) => {
    const url = api(`/forms/${form.id}/questions`)
    return client.post<Question>(url, data).then(questions.add)
  }
}
