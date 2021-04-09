import FormControl from '@material-ui/core/FormControl'
import Icon from '@material-ui/core/Icon'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import {
  RESOURCE_ICON,
  RESOURCE_ITEM,
} from 'Event/Dashboard/components/ResourceList'
import {
  onUnknownChangeHandler,
  onChangeStringHandler,
  onChangeCheckedHandler,
} from 'lib/dom'
import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import {useCallback} from 'react'
import ResourceUpload, {useDeleteFile} from './ResourceUpload'
import {Resource} from 'Event/Dashboard/components/ResourceList/ResourceItem'
import Grid from '@material-ui/core/Grid'
import Switch from 'lib/ui/form/Switch'
import RuleConfig, {
  useRuleConfig,
} from 'Event/Dashboard/component-rules/RuleConfig'
import ConfigureRulesButton from 'Event/Dashboard/component-rules/ConfigureRulesButton'

export type ResourceItemConfig = {
  type: typeof RESOURCE_ITEM
  id: number
}

export function ResourceItemConfig(props: {id: ResourceItemConfig['id']}) {
  const {resourceList: list} = useTemplate()
  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()
  const deleteFile = useDeleteFile()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  if (typeof props.id === 'undefined') {
    throw new Error('Missing component id')
  }

  const resource = list.resources[props.id]

  const update = useCallback(
    <T extends keyof Resource>(key: T) => (value: Resource[T]) => {
      const updated = {
        ...resource,
        [key]: value,
      }

      updateTemplate({
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
    },
    [list, props.id, resource, updateTemplate],
  )

  const remove = () => {
    if (resource.filePath) {
      deleteFile(resource.filePath).catch((e) => {
        // Log error, but prevent it from crashing
        // app
        console.error(e)
      })
    }

    closeConfig()
    updateTemplate({
      resourceList: {
        ...list,
        resources: list.resources.filter((_, index) => index !== props.id),
      },
    })
  }

  return (
    <RuleConfig
      visible={ruleConfigVisible}
      close={toggleRuleConfig}
      rules={resource.rules}
      onChange={update('rules')}
    >
      <>
        <ConfigureRulesButton onClick={toggleRuleConfig} />
        <TextField
          value={resource.name}
          inputProps={{
            'aria-label': 'resource name',
          }}
          label="Name"
          fullWidth
          onChange={onChangeStringHandler(update('name'))}
        />
        <ResourceUpload resource={resource} update={update} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
            <Switch
              checked={resource.isVisible}
              onChange={onChangeCheckedHandler(update('isVisible'))}
              arial-label="config switch to attendee"
              labelPlacement="top"
              color="primary"
              label={resource.isVisible ? 'Enable' : 'Disable'}
            />
          </Grid>
        </Grid>

        <RemoveButton
          fullWidth
          variant="outlined"
          aria-label="remove resource"
          onClick={remove}
        >
          REMOVE RESOURCE
        </RemoveButton>
      </>
    </RuleConfig>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
