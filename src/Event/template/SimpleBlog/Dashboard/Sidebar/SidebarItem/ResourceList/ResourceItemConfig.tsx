import TextField from '@material-ui/core/TextField'
import {onChangeCheckedHandler} from 'lib/dom'
import React, {useEffect, useState} from 'react'
import ResourceUpload, {
  useDeleteFile,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceUpload'
import {Resource} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceItem'
import Grid from '@material-ui/core/Grid'
import Switch from 'lib/ui/form/Switch'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import FormControl from '@material-ui/core/FormControl'
import IconSelect from 'lib/fontawesome/IconSelect'
import ComponentConfig, {
  ComponentConfigProps,
  RemoveButton,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm, UseFormMethods} from 'react-hook-form'
import {ResourceListProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'
import {useUpdateSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

export function ResourceItemConfig(
  props: ComponentConfigProps & {
    resource: Resource
    index?: number
    list: ResourceListProps
  },
) {
  const {resource, index, isVisible, onClose} = props
  const {list} = props
  const updateItem = useUpdateSidebarItem()

  const deleteFile = useDeleteFile()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  const {register, handleSubmit, control} = useForm()

  const [rules, setRules] = useState(resource.rules)
  const [isUrl, setIsUrl] = useState(resource.isUrl)
  const [filePath, setFilePath] = useState(resource.filePath)

  const isEditing = index !== undefined

  useEffect(() => {
    if (isVisible) {
      return
    }

    setRules(resource.rules)
    setIsUrl(resource.isUrl)
    setFilePath(resource.filePath)
  }, [resource, isVisible])

  const update = (index: number, data: Resource) => {
    updateItem({
      ...list,
      resources: list.resources.map((r, i) => {
        const isTarget = i === index
        if (isTarget) {
          return data
        }

        return r
      }),
    })
  }

  const insert = (newResource: Resource) => {
    updateItem({
      ...list,
      resources: [...list.resources, newResource],
    })
  }

  const save = (formData: any) => {
    const data: Resource = {
      rules,
      isUrl,
      filePath,
      ...formData,
    }

    if (index !== undefined) {
      update(index, data)
      onClose()
      return
    }

    insert(data)
    onClose()
  }

  const remove = () => {
    if (!isEditing) {
      throw new Error('Called remove outside of editing resource.')
    }

    if (resource.filePath) {
      deleteFile(resource.filePath).catch((e) => {
        // Log error, but prevent it from crashing
        // app
        console.error(e)
      })
    }

    onClose()
    updateItem({
      ...list,
      resources: list.resources.filter((_, i) => i !== index),
    })
  }

  return (
    <ComponentConfig title="Resource" onClose={onClose} isVisible={isVisible}>
      <RuleConfig
        visible={ruleConfigVisible}
        close={toggleRuleConfig}
        rules={rules}
        onChange={setRules}
      >
        <>
          <ConfigureRulesButton onClick={toggleRuleConfig} />
          <form onSubmit={handleSubmit(save)}>
            <TextField
              name="name"
              defaultValue={resource.name}
              inputProps={{
                'aria-label': 'resource name',
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
                  aria-label="set url resource"
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
              aria-label="remove resource"
              onClick={remove}
              showing={isEditing}
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
        'aria-label': 'resource external file url',
        ref: props.register,
      }}
      label="URL starting with http:// or https://"
      fullWidth
    />
  )
}
