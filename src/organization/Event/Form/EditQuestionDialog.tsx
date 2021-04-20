import React, {useState} from 'react'
import download from 'js-file-download'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {Question, useQuestions} from 'organization/Event/QuestionsProvider'
import Form from 'organization/Event/Form/CreateQuestionDialog/Form'
import DangerButton from 'lib/ui/Button/DangerButton'
import {colors, spacing} from 'lib/ui/theme'
import {withStyles} from '@material-ui/core/styles'
import {CsvExport} from 'lib/api-client'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from 'lib/ui/Button'

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

function ExportSubmission(props: {question: Question}) {
  const [error, setError] = useState<string | null>(null)
  const url = api(`/questions/${props.question.id}/submissions`)
  const {client} = useOrganization()

  const exportSubmissions = () => {
    client
      .get<CsvExport>(url)
      .then((res) => download(res.data, res.file_name))
      .catch((e) => setError(e.message))
  }

  return (
    <Box textAlign="right" mb={3}>
      <Button
        onClick={exportSubmissions}
        variant="text"
        textColor={colors.secondary}
        aria-label={`export ${props.question.label} submissions`}
      >
        Download Submissions
      </Button>
      <ExportError>{error}</ExportError>
    </Box>
  )
}

function ExportError(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}
