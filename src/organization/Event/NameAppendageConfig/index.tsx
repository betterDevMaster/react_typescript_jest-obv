import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React, {useState} from 'react'
import {
  NameAppendage,
  useNameAppendages,
} from 'organization/Event/NameAppendageConfig/NameAppendageProvider'
import NameAppendageAddDialog from 'organization/Event/NameAppendageConfig/AddDialog'
import NameAppendageUpdateDialog from 'organization/Event/NameAppendageConfig/UpdateDialog'
import NameAppendageAddButton from 'organization/Event/NameAppendageConfig/AddDialog/addButton'
import NameAppendageListTable from 'organization/Event/NameAppendageConfig/ListTable'

export default function NameAppendageConfig() {
  const [adding, setAdding] = useState<boolean>(false)
  const {name_appendages} = useNameAppendages()
  const [nameAppendagesList, setNameAppendagesListList] = useState<
    NameAppendage[]
  >(name_appendages)
  const [editing, setEditing] = useState<NameAppendage | null>(null)

  const add = () => setAdding(true)
  const closeAddDialog = () => setAdding(false)
  const setEditDialog = (nameAppendage: NameAppendage) =>
    setEditing(nameAppendage)
  const closeEditDialog = () => setEditing(null)

  const changeNameAppendagesList = (name_appendage: NameAppendage[]) =>
    setNameAppendagesListList(name_appendage)

  return (
    <Layout>
      <Page>
        <NameAppendageAddDialog
          isOpen={adding}
          onClose={closeAddDialog}
          setNameAppendages={changeNameAppendagesList}
          nameAppendages={nameAppendagesList}
        />

        <NameAppendageUpdateDialog
          nameAppendage={editing}
          nameAppendages={nameAppendagesList}
          setNameAppendages={changeNameAppendagesList}
          onClose={closeEditDialog}
        />

        <NameAppendageAddButton openAdd={add} />
        <NameAppendageListTable
          setEditing={setEditDialog}
          nameAppendages={nameAppendagesList}
          setNameAppendages={changeNameAppendagesList}
        />
      </Page>
    </Layout>
  )
}
