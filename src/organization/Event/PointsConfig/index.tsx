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
import ExportLeaderboardButton from 'organization/Event/PointsConfig/ExportLeaderboardButton'
import {useToggleActions} from 'organization/Event/PointsConfig/active'
import LeaderboardSettingsDialog from 'organization/Event/PointsConfig/LeaderboardSettingsDialog'
import Box from '@material-ui/core/Box'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'

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
  const [error, setError] = useState<string | null>(null)

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
      <LeaderboardSettingsDialog
        visible={pageSettingsVisible}
        onClose={togglePageSettings}
      />
      <ButtonContainer>
        <StyledAddActionButton onAdd={edit} />
        <RightButtons>
          <StyledExportLeaderboardButton onError={setError} />
          <Button
            variant="outlined"
            color="primary"
            onClick={togglePageSettings}
            aria-label="configure leaderboard page"
          >
            Page Settings
          </Button>
        </RightButtons>
      </ButtonContainer>
      <ErrorAlert>{error}</ErrorAlert>
      <Box display="flex" justifyContent="flex-end">
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
      <ActionsTable actions={actions} onSelect={edit} />
    </>
  )
}

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing[4]};
  flex-wrap: wrap;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    flex-wrap: nowrap;
  }
`

const RightButtons = styled.div`
  display: flex;
  width: 100%;

  button {
    flex: 1;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    display: inline-block;
    width: auto;
  }
`

const StyledAddActionButton = styled(AddActionButton)`
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
  width: 100% !important;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: auto !important;
    margin-bottom: 0;
  }
`

const StyledExportLeaderboardButton = styled(ExportLeaderboardButton)`
  margin-right: ${(props) => props.theme.spacing[2]}!important;
`
