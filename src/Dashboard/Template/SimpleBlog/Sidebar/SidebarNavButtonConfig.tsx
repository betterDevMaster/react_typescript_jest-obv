import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import NavButton from 'Dashboard/components/NavButton'
import {
  onChangeCheckedHandler,
  onChangeNumberHandler,
  onChangeStringHandler,
} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import Box from '@material-ui/core/Box'
import {
  useCloseConfig,
  useUpdateDashboard,
} from 'Dashboard/edit/state/edit-mode'
import {Config} from 'Dashboard/edit/views/DashboardEditDialog/ConfigComponent'

export default function SidebarNavButtonConfig(props: {id?: Config['id']}) {
  const buttons = useSelector(
    (state: RootState) => state.dashboardEditor.sidebarNav,
  )

  const updateDashboard = useUpdateDashboard()
  const closeConfig = useCloseConfig()
  const {id} = props

  if (!id) {
    throw new Error('Missing component id')
  }

  if (!buttons) {
    throw new Error('Missing nav buttons')
  }
  const button = buttons.entities[id]

  const update = (updated: NavButton) => {
    updateDashboard({
      sidebarNav: {
        ...buttons,
        entities: {
          ...buttons.entities,
          [id]: updated,
        },
      },
    })
  }

  const removeButton = () => {
    const {[id]: target, ...otherButtons} = buttons.entities
    const updatedIds = buttons.ids.filter((i) => i !== id)

    closeConfig()
    updateDashboard({
      sidebarNav: {
        entities: otherButtons,
        ids: updatedIds,
      },
    })
  }

  const updateButton = <T extends keyof NavButton>(key: T) => (
    value: NavButton[T],
  ) =>
    update({
      ...button,
      [key]: value,
    })

  return (
    <>
      <TextField
        label="Text"
        value={button.text}
        inputProps={{
          'aria-label': 'button name input',
        }}
        fullWidth
        onChange={onChangeStringHandler(updateButton('text'))}
      />
      <TextField
        label="Link URL"
        value={button.link}
        inputProps={{
          'aria-label': 'button link input',
        }}
        fullWidth
        onChange={onChangeStringHandler(updateButton('link'))}
      />
      <FormControl>
        <FormControlLabel
          label="New Tab"
          control={
            <Checkbox
              checked={button.newTab || false}
              onChange={onChangeCheckedHandler(updateButton('newTab'))}
            />
          }
        />
      </FormControl>
      <TextField
        value={button.borderRadius || ''}
        label="Border Radius"
        type="number"
        fullWidth
        inputProps={{
          min: 0,
        }}
        onChange={onChangeNumberHandler(updateButton('borderRadius'))}
      />

      <Box mt={2} mb={3}>
        <DangerButton
          fullWidth
          variant="outlined"
          aria-label="remove button"
          onClick={removeButton}
        >
          REMOVE BUTTON
        </DangerButton>
      </Box>
    </>
  )
}
