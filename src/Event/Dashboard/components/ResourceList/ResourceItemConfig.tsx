import TextField from '@material-ui/core/TextField'
import {RESOURCE_ITEM} from 'Event/Dashboard/components/ResourceList'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import {useCallback} from 'react'
import ResourceUpload, {
  useDeleteFile,
} from 'Event/Dashboard/components/ResourceList/ResourceUpload'
import {Resource} from 'Event/Dashboard/components/ResourceList/ResourceItem'
import Grid from '@material-ui/core/Grid'
import Switch from 'lib/ui/form/Switch'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import FormControl from '@material-ui/core/FormControl'
import IconSelect from 'lib/fontawesome/IconSelect'

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

  const setUrl = (url: string) => {
    update('url')(url)
  }

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
        <FormControl>
          <ToggleButtonGroup
            value={resource.isUrl ? 'true' : 'false'}
            exclusive
          >
            <ToggleButton value="false" onClick={() => update('isUrl')(false)}>
              File
            </ToggleButton>
            <ToggleButton
              value="true"
              aria-label="set url resource"
              onClick={() => update('isUrl')(true)}
            >
              Link
            </ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
        <ResourceUpload resource={resource} update={update} />
        <UrlField resource={resource} onChange={setUrl} />
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <IconSelect value={resource.icon} onChange={update('icon')} />
          </Grid>
          <Grid item xs={4}>
            <Switch
              checked={resource.isVisible}
              onChange={onChangeCheckedHandler(update('isVisible'))}
              arial-label="config visible switch"
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

function UrlField(props: {
  resource: Resource
  onChange: (url: string) => void
}) {
  if (!props.resource.isUrl) {
    return null
  }

  return (
    <TextField
      value={props.resource.url}
      inputProps={{
        'aria-label': 'resource external file url',
      }}
      label="URL starting with http:// or https://"
      fullWidth
      onChange={onChangeStringHandler(props.onChange)}
    />
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
