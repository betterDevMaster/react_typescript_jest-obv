import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import Layout from 'organization/user/Layout'
import {Action, useActions} from 'Event/ActionsProvider'
import ActionsTable from 'organization/Event/PointsConfig/ActionTable'
import AddActionButton from 'organization/Event/PointsConfig/AddActionButton'
import ActionEditDialog from 'organization/Event/PointsConfig/ActionEditDialog'
import Page from 'organization/Event/Page'
import {OrganizationActionsProvider} from 'Event/ActionsProvider'
import {onChangeCheckedHandler} from 'lib/dom'
import {useToggleActions} from './active'
import LeaderboardPageSettingsDialog from './LeaderboardPageSettingsDialog'

export default function PointsConfig() {
  return (
    <Layout>
      <Page>
        <OrganizationActionsProvider>
          <Content />
        </OrganizationActionsProvider>
      </Page>
    </Layout>
  )
}

function Content() {
  const {actions, setActions} = useActions()
  const toggleActions = useToggleActions()
  const [editing, setEditing] = useState<Action | null>(null)
  const [checked, setChecked] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [pageSettingsVisible, setPageSettingsVisible] = useState(false)

  const edit = (action: Action) => setEditing(action)
  const closeEditDialog = () => setEditing(null)
  const toggleAll = (active: boolean) => {
    setProcessing(true)
    toggleActions(active)
      .then((actions: Action[]) => {
        setActions(actions)
      })
      .finally(() => setProcessing(false))
  }

  const togglePageSettings = () => setPageSettingsVisible(!pageSettingsVisible)

  useEffect(() => {
    setChecked(actions.every((action: Action) => action.is_active))
  }, [actions])

  return (
    <>
      <ActionEditDialog action={editing} onClose={closeEditDialog} />
      <LeaderboardPageSettingsDialog
        visible={pageSettingsVisible}
        onClose={togglePageSettings}
      />
      <Box>
        <ButtonContainer>
          <AddActionButton onAdd={edit} />
          <Button
            variant="outlined"
            color="primary"
            onClick={togglePageSettings}
            aria-label="configure leaderboard page"
          >
            Leaderboard Page Settings
          </Button>
        </ButtonContainer>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                disabled={processing}
                inputProps={{
                  'aria-label': 'toggle all',
                }}
                onChange={onChangeCheckedHandler(toggleAll)}
              />
            }
            label={`${checked ? 'Disable' : 'Enable'} All`}
            labelPlacement="start"
          />
        </Box>
      </Box>
      <ActionsTable actions={actions} onSelect={edit} />
    </>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 500px;
`
