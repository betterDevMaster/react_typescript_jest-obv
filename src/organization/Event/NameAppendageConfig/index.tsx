import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React, {useState} from 'react'
import {NameAppendage} from 'organization/Event/NameAppendageConfig/NameAppendageProvider'
import NameAppendageAddDialog from 'organization/Event/NameAppendageConfig/AddDialog'
import NameAppendageUpdateDialog from 'organization/Event/NameAppendageConfig/UpdateDialog'
import NameAppendageListTable from 'organization/Event/NameAppendageConfig/ListTable'
import NameAppendageAddButton from 'organization/Event/NameAppendageConfig/AddDialog/button'

export default function NameAppendageConfig() {
  const [adding, setAdding] = useState<boolean>(false)
  const [editing, setEditing] = useState<NameAppendage | null>(null)

  const add = () => setAdding(true)
  const closeAddDialog = () => setAdding(false)
  const setEditDialog = (nameAppendage: NameAppendage) =>
    setEditing(nameAppendage)
  const closeEditDialog = () => setEditing(null)

  return (
    <Layout>
      <Page>
        <NameAppendageAddButton openAdd={add} />

        <NameAppendageAddDialog isOpen={adding} onClose={closeAddDialog} />
        <NameAppendageUpdateDialog
          nameAppendage={editing}
          onClose={closeEditDialog}
        />

        <NameAppendageListTable setEditing={setEditDialog} />
      </Page>
    </Layout>
  )
}
