import Button from '@material-ui/core/Button'
import Page from 'organization/Event/Page'
import CreateDialog from 'organization/Event/QuestionsConfig/CreateDialog'
import EditDialog from 'organization/Event/QuestionsConfig/EditDialog'
import QuestionsList from 'organization/Event/QuestionsConfig/QuestionsList'
import {Question} from 'organization/Event/QuestionsProvider'
import Layout from 'organization/user/Layout'
import React, {useState} from 'react'

export default function QuestionsConfig() {
  const [editing, setEditing] = useState<Question | null>(null)
  const [addQuestionDialogVisible, setAddQuestionDialogVisible] = useState(
    false,
  )

  const toggleAddQuestionDialog = () =>
    setAddQuestionDialogVisible(!addQuestionDialogVisible)

  const stopEditing = () => setEditing(null)

  return (
    <Layout>
      <Page>
        <CreateDialog
          isVisible={addQuestionDialogVisible}
          onClose={toggleAddQuestionDialog}
        />
        <EditDialog question={editing} onClose={stopEditing} />
        <QuestionsList onSelect={setEditing} />
        <Button
          fullWidth
          size="large"
          variant="contained"
          color="primary"
          aria-label="add question"
          onClick={toggleAddQuestionDialog}
        >
          Add Question
        </Button>
      </Page>
    </Layout>
  )
}
