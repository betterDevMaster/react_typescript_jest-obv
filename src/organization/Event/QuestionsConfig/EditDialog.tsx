import React, {useState} from 'react'
import download from 'js-file-download'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {Question, useQuestions} from 'organization/Event/QuestionsProvider'
import Form from 'organization/Event/QuestionsConfig/Form'
import DangerButton from 'lib/ui/Button/DangerButton'
import {colors, spacing} from 'lib/ui/theme'
import {withStyles} from '@material-ui/core/styles'
import {CsvExport} from 'lib/api-client'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from 'lib/ui/Button'

export default function EditDialog(props: {
  question: Question | null
  onClose: () => void
}) {
  const {question} = props
  const update = useUpdate()
  const remove = useRemove(props.onClose)

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
          submit={update.bind(null, question)}
          onClose={props.onClose}
          isRegistrationQuestion={true}
          footer={
            <RemoveButton
              variant="outlined"
              fullWidth
              onClick={remove(question)}
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

function useUpdate() {
  const list = useQuestions()
  const {event} = useEvent()
  const {client} = useOrganization()

  return (question: Question, data: Partial<Question>) => {
    const url = api(`/events/${event.slug}/questions/${question.id}`)
    return client.put<Question>(url, data).then(list.update)
  }
}

function useRemove(onDone: () => void) {
  const list = useQuestions()
  const {event} = useEvent()
  const {client} = useOrganization()
  const [processing, setProcessing] = useState(false)

  return (question: Question) => () => {
    if (processing) {
      return
    }

    setProcessing(true)

    const url = api(`/events/${event.slug}/questions/${question.id}`)
    return client
      .delete(url)
      .then(() => {
        list.remove(question)
        onDone()
      })
      .finally(() => {
        setProcessing(false)
      })
  }
}

const RemoveButton = withStyles({
  root: {
    marginTop: spacing[4],
  },
})(DangerButton)

function ExportSubmission(props: {question: Question}) {
  const [error, setError] = useState<string | null>(null)
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/submissions/${props.question.id}`)
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
        Download Answers
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
