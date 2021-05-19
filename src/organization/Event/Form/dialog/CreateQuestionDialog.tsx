import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Form from 'organization/Event/Form/dialog/Form'
import {useQuestions} from 'organization/Event/QuestionsProvider'
import React from 'react'

export default function CreateQuestionDialog(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const questions = useQuestions()

  return (
    <Dialog open={props.isVisible} onClose={props.onClose}>
      <DialogTitle>Add Question</DialogTitle>
      <DialogContent>
        <Form onComplete={questions.add} onClose={props.onClose} />
      </DialogContent>
    </Dialog>
  )
}
