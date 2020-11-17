import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import Icon from '@material-ui/core/Icon'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import {Resource, RESOURCE_ICON} from 'event/Dashboard/components/ResourceList'
import {onUnknownChangeHandler, onChangeStringHandler} from 'lib/dom'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useCloseConfig} from 'event/Dashboard/editor/state/edit-mode'
import {Config} from 'event/Dashboard/editor/views/DashboardEditDialog/ConfigComponent'
import {
  useDashboard,
  useUpdateDashboard,
} from 'event/Dashboard/state/DashboardProvider'

export default function ResourceItemConfig(props: {id: Config['id']}) {
  const {resourceList: list} = useDashboard()

  const updateDashboard = useUpdateDashboard()
  const closeConfig = useCloseConfig()

  if (props.id === undefined || typeof props.id !== 'number') {
    throw new Error('Missing component id')
  }

  const resource = list.resources[props.id]

  const update = <T extends keyof Resource>(key: T) => (value: Resource[T]) => {
    const updated = {
      ...resource,
      [key]: value,
    }

    updateDashboard({
      resourceList: {
        ...list,
        resources: list.resources.map((r, index) => {
          const isTarget = index === props.id
          if (isTarget) {
            return updated
          }

          return r
        }),
      },
    })
  }

  const remove = () => {
    closeConfig()
    updateDashboard({
      resourceList: {
        ...list,
        resources: list.resources.filter((_, index) => index !== props.id),
      },
    })
  }

  return (
    <>
      <TextField
        value={resource.name}
        inputProps={{
          'aria-label': 'resource name',
        }}
        label="Name"
        fullWidth
        onChange={onChangeStringHandler(update('name'))}
      />
      <TextField
        value={resource.filePath}
        inputProps={{
          'aria-label': 'resource file path',
        }}
        label="File Path"
        fullWidth
        onChange={onChangeStringHandler(update('filePath'))}
      />
      <FormControl fullWidth>
        <InputLabel>File Icon</InputLabel>
        <Select
          value={resource.icon}
          fullWidth
          onChange={onUnknownChangeHandler(update('icon'))}
          inputProps={{
            'aria-label': 'resource icon',
          }}
        >
          {Object.values(RESOURCE_ICON).map((icon) => (
            <MenuItem key={icon} value={icon}>
              <Icon component="i">{icon}</Icon>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <RemoveButton
        fullWidth
        variant="outlined"
        aria-label="remove resource"
        onClick={remove}
      >
        REMOVE RESOURCE
      </RemoveButton>
    </>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
