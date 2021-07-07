import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import {Question, useQuestions} from 'organization/Event/QuestionsProvider'
import Form from 'organization/Event/Form/dialog/Form'
import DangerButton from 'lib/ui/Button/DangerButton'
import {spacing} from 'lib/ui/theme'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {useSubmissionsExport} from 'organization/Event/Form/FormActions'

export default function QuestionEditDialog(props: {
  question: Question | null
  onClose: () => void
}) {
  const {question} = props
  const list = useQuestions()
  const remove = () => {
    if (!question) {
      return
    }

    list.remove(question)
    props.onClose()
  }

  const isVisible = Boolean(question)

  if (!question) {
    return null
  }

  return (
    <Dialog open={isVisible} onClose={props.onClose}>
      <DialogTitle>Edit Question</DialogTitle>
      <DialogContent>
        <ExportSubmission question={question} />
        <Form
          question={question}
          onComplete={list.update}
          onClose={props.onClose}
          footer={
            <RemoveButton
              variant="outlined"
              fullWidth
              onClick={remove}
              aria-label="remove question"
            >
              Remove
            </RemoveButton>
          }
        />
      </DialogContent>
    </Dialog>
  )
}

const RemoveButton = withStyles({
  root: {
    marginTop: spacing[4],
  },
})(DangerButton)

export type ExportResponse = {
  message: string | null
}

function ExportSubmission(props: {question: Question}) {
  const endpoint = `/questions/${props.question.id}/submissions`
  const {
    exportSubmissions,
    errorMessage: error,
    successMessage,
    processing,
  } = useSubmissionsExport(endpoint)

  return (
    <Box textAlign="right" mb={3}>
      <Button
        onClick={exportSubmissions}
        variant="outlined"
        aria-label={`export ${props.question.label} submissions`}
        disabled={processing}
      >
        Download Submissions
      </Button>
      <ExportError>{error}</ExportError>
      <Success>{successMessage}</Success>
    </Box>
  )
}

function ExportError(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}

function Success(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="primary">{props.children}</Typography>
}
