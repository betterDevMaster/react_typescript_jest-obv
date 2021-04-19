import Button from '@material-ui/core/Button'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React, {useState} from 'react'
import Forms from 'organization/Event/FormsConfig/Forms'
import CreateFormDialog from 'organization/Event/FormsConfig/CreateFormDialog'

export default function FormsConfig() {
  const [addFormDialogVisible, setAddFormDialogVisible] = useState(false)

  const toggleAddFormDialog = () =>
    setAddFormDialogVisible(!addFormDialogVisible)

  return (
    <Layout
      navbarRight={
        <Button
          variant="contained"
          color="primary"
          aria-label="add form"
          onClick={toggleAddFormDialog}
        >
          Add Form
        </Button>
      }
    >
      <Page>
        <CreateFormDialog
          isVisible={addFormDialogVisible}
          onClose={toggleAddFormDialog}
        />
        <Forms />
      </Page>
    </Layout>
  )
}
