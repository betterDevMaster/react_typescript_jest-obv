import TextField from '@material-ui/core/TextField'
import {v4 as uuid} from 'uuid'
import {onChangeCheckedHandler} from 'lib/dom'
import React, {useEffect, useState, useCallback} from 'react'
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
import {REMOVE, useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

export function ResourceItemConfig(
  props: ComponentConfigProps & {
    id?: string
    resource: Resource
    list: ResourceListProps
  },
) {
  const {resource, id, isVisible, onClose} = props

  const deleteFile = useDeleteFile()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  const {register, handleSubmit, control} = useForm()

  const [rules, setRules] = useState(resource.rules)
  const [isUrl, setIsUrl] = useState(resource.isUrl)
  const [filePath, setFilePath] = useState(resource.filePath)
  const {update: updateItem} = useEditSidebarItem()

  useEffect(() => {
    if (isVisible) {
      return
    }

    setRules(resource.rules)
    setIsUrl(resource.isUrl)
    setFilePath(resource.filePath)
  }, [resource, isVisible])

  const update = (id: string, data: Resource) => {
    updateItem({
      resources: {
        [id]: data,
      },
    })
  }

  const insert = (newResource: Resource) => {
    const id = uuid()

    updateItem({
      resources: {
        [id]: newResource,
      },
    })
  }

  const save = (
    form: Pick<Resource, 'name' | 'url' | 'isVisible' | 'icon'>,
  ) => {
    const data: Resource = {
      ...form,
      rules,
      isUrl,
      filePath,
    }

    if (id !== undefined) {
      update(id, data)
      onClose()
      return
    }

    insert(data)
    onClose()
  }

  const remove = useCallback(() => {
    if (!id) {
      throw new Error('Called remove outside of editing resource.')
    }

    if (resource.filePath) {
      deleteFile(resource.filePath).catch((e) => {
        // Log error, but prevent it from crashing
        // app
        console.error(e)
      })
    }

    updateItem({
      resources: {
        [id]: REMOVE,
      },
    })

    onClose()
  }, [deleteFile, id, onClose, resource, updateItem])

  useRemoveIfEmpty(remove, props.resource, {shouldSkip: !id})

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
              showing={Boolean(id)}
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
