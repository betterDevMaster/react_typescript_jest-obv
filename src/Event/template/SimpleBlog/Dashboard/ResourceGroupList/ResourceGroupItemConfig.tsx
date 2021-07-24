import TextField from '@material-ui/core/TextField'

import {onChangeCheckedHandler} from 'lib/dom'
import styled from 'styled-components'
import React, {useState, useEffect} from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import ResourceUpload, {
  useDeleteFile,
} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceUpload'
import {Resource} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceItem'
import Grid from '@material-ui/core/Grid'
import Switch from 'lib/ui/form/Switch'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import FormControl from '@material-ui/core/FormControl'
import IconSelect from 'lib/fontawesome/IconSelect'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm, UseFormMethods} from 'react-hook-form'
import {ResourceGroup} from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/ResourceGroup'

export function ResourceGroupItemConfig(
  props: ComponentConfigProps & {
    resource: Resource
    groupIndex: number
    id?: number
  },
) {
  const {resource, id, isVisible, groupIndex, onClose} = props

  const {
    template: {resourceGroupList: list},
  } = useSimpleBlog()
  const updateTemplate = useDispatchUpdate()
  const deleteFile = useDeleteFile()
  const {register, handleSubmit, control} = useForm()

  const items = list?.groups

  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  const [rules, setRules] = useState(resource.rules)
  const [isUrl, setIsUrl] = useState(resource.isUrl)
  const [filePath, setFilePath] = useState(resource.filePath)

  useEffect(() => {
    if (isVisible) {
      return
    }

    setRules(resource.rules)
    setIsUrl(resource.isUrl)
    setFilePath(resource.filePath)
  }, [resource, isVisible])

  const update = (data: Resource) => {
    const updatedList = items[groupIndex].resources.map((r, index) => {
      if (index === id) {
        return data
      }
      return r
    })

    const updatedGroups = items.map((item, index) => {
      if (index === props.groupIndex) {
        const updated = {
          ...item,
          resources: updatedList,
        }
        return updated
      }
      return item
    })
    updateTemplate({
      resourceGroupList: {
        groups: updatedGroups,
      },
    })
  }

  const insert = (newResource: Resource) => {
    const updatedList = [...items[groupIndex].resources, newResource]
    const updatedGroup = items.map((group, index) => {
      if (index === props.groupIndex) {
        const updated = {
          ...group,
          resources: updatedList,
        }
        return updated
      }
      return group
    })
    updateTemplate({
      resourceGroupList: {
        groups: updatedGroup,
      },
    })
  }

  const save = (formData: any) => {
    const data: Resource = {
      rules,
      isUrl,
      filePath,
      ...formData,
    }

    if (id !== undefined) {
      update(data)
      onClose()
      return
    }

    insert(data)
    onClose()
  }

  const remove = () => {
    if (id === undefined) {
      throw new Error('Missing resource item index')
    }

    if (resource.filePath) {
      deleteFile(resource.filePath).catch((e) => {
        console.error(e)
      })
    }

    const group = items[groupIndex]
    const updatedResources = group.resources.filter((_, i) => i !== id)

    const updatedGroup: ResourceGroup = {...group, resources: updatedResources}

    const updatedGroups = items.map((tr, index) => {
      if (index === props.groupIndex) {
        return updatedGroup
      }
      return tr
    })
    onClose()

    updateTemplate({
      resourceGroupList: {
        groups: updatedGroups,
      },
    })
  }

  return (
    <ComponentConfig title="Resource" onClose={onClose} isVisible={isVisible}>
      <RuleConfig
        visible={ruleConfigVisible}
        close={toggleRuleConfig}
        rules={resource.rules}
        onChange={setRules}
      >
        <>
          <ConfigureRulesButton onClick={toggleRuleConfig} />
          <form onSubmit={handleSubmit(save)}>
            <TextField
              name="name"
              defaultValue={resource.name}
              inputProps={{
                'aria-label': 'grouped resource name',
                ref: register,
              }}
              label="Name"
              fullWidth
            />
            <FormControl>
              <ToggleButtonGroup
                value={resource.isUrl ? 'true' : 'false'}
                exclusive
              >
                <ToggleButton value="false" onClick={() => setIsUrl(false)}>
                  File
                </ToggleButton>
                <ToggleButton
                  value="true"
                  aria-label="set url grouped resource"
                  onClick={() => setIsUrl(true)}
                >
                  Link
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            <ResourceUpload
              isUrl={isUrl}
              filePath={filePath}
              onChange={setFilePath}
            />

            <UrlField
              defaultValue={resource.url || ''}
              register={register}
              isUrl={isUrl}
            />
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="icon"
                  defaultValue={resource.icon || ''}
                  render={({value, onChange}) => (
                    <IconSelect value={value || null} onChange={onChange} />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="isVisible"
                  control={control}
                  defaultValue={resource.isVisible || false}
                  render={({value, onChange}) => (
                    <Switch
                      checked={value}
                      onChange={onChangeCheckedHandler(onChange)}
                      arial-label="config visible switch"
                      labelPlacement="top"
                      color="primary"
                      label={value ? 'Enable' : 'Disable'}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <SaveButton type="submit" />

            <RemoveButton
              fullWidth
              variant="outlined"
              aria-label="remove grouped resource"
              onClick={remove}
            >
              REMOVE RESOURCE
            </RemoveButton>
          </form>
        </>
      </RuleConfig>
    </ComponentConfig>
  )
}

function UrlField(props: {
  isUrl?: boolean
  register: UseFormMethods['register']
  defaultValue: string
}) {
  if (!props.isUrl) {
    return null
  }

  return (
    <TextField
      name="url"
      defaultValue={props.defaultValue}
      inputProps={{
        'aria-label': 'resource grouped with external file url',
        ref: props.register,
      }}
      label="URL starting with http:// or https://"
      fullWidth
    />
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
