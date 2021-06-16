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
import DangerButton from 'lib/ui/Button/DangerButton'
import {useOrganization} from 'organization/OrganizationProvider'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import ConfirmDialog from 'lib/ui/ConfirmDialog'

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
  const {clear, processing: processingClear} = useClearLeaderboard()

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
          <ConfirmDialog
            onConfirm={clear}
            description="Clearing the leaderboard will remove all attendee points. This action CANNOT be reversed."
          >
            {(confirm) => (
              <DangerButton
                variant="contained"
                onClick={confirm}
                disabled={processingClear}
              >
                Clear Leaderboard
              </DangerButton>
            )}
          </ConfirmDialog>
          <ExportLeaderboardButton onError={setError} />
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

function useClearLeaderboard() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const clear = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    const url = api(`/events/${event.slug}/leaderboard`)
    client.delete(url).finally(toggleProcessing)
  }

  return {clear, processing}
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
  margin: 0 -${(props) => props.theme.spacing[1]}!important;

  button {
    flex: 1;
    margin: 0 ${(props) => props.theme.spacing[1]}!important;
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
