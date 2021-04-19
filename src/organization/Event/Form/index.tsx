import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import Page from 'organization/Event/Page'
import CreateDialog from 'organization/Event/Form/CreateDialog'
import FormActions from 'organization/Event/Form/FormActions'
import QuestionsProvider, {Question} from 'organization/Event/QuestionsProvider'
import Layout from 'organization/user/Layout'
import React, {useState} from 'react'
import EditDialog from 'organization/Event/Form/EditDialog'
import QuestionsList from 'organization/Event/Form/QuestionsList'
import {useForm} from 'organization/Event/Form/FormProvider'
import NameField from 'organization/Event/Form/NameField'

export default function Form() {
  const {form} = useForm()
  const [editing, setEditing] = useState<Question | null>(null)
  const [addQuestionDialogVisible, setAddQuestionDialogVisible] = useState(
    false,
  )

  const toggleAddQuestionDialog = () =>
    setAddQuestionDialogVisible(!addQuestionDialogVisible)

  const stopEditing = () => setEditing(null)

  return (
    <QuestionsProvider form={form}>
      <Layout>
        <Page>
          <CreateDialog
            isVisible={addQuestionDialogVisible}
            onClose={toggleAddQuestionDialog}
          />
          <EditDialog question={editing} onClose={stopEditing} />
          <StyledFormActions />
          <NameField />
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
    </QuestionsProvider>
  )
}

const StyledFormActions = styled(FormActions)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
