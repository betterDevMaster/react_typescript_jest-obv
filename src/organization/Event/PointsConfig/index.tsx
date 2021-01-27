import React, {useState} from 'react'
import Layout from 'organization/user/Layout'
import {Action, useActions} from 'Event/ActionsProvider'
import ActionsTable from 'organization/Event/PointsConfig/ActionTable'
import AddActionButton from 'organization/Event/PointsConfig/AddActionButton'
import ActionEditDialog from 'organization/Event/PointsConfig/ActionEditDialog'
import Page from 'organization/Event/Page'

export default function PointsConfig() {
  const {platform, custom} = useActions()
  const [editing, setEditing] = useState<Action | null>(null)

  const edit = (action: Action) => setEditing(action)
  const closeEditDialog = () => setEditing(null)

  /**
   * Combine actions, and make sure platform actions appear before
   * custom ones.
   */
  const actions = [...platform.actions, ...custom.actions]

  return (
    <>
      <ActionEditDialog action={editing} onClose={closeEditDialog} />
      <Layout>
        <Page>
          <AddActionButton onAdd={edit} />
          <ActionsTable actions={actions} onSelect={edit} />
        </Page>
      </Layout>
    </>
  )
}
