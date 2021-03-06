import React, {useEffect, useState} from 'react'
import {Controller, useForm, UseFormMethods} from 'react-hook-form'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import {onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import {
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'
import {Resource} from 'Event/template/NiftyFifty/Dashboard/Resources/ResourceList'
import ResourceUpload, {
  useDeleteFile,
} from 'Event/template/NiftyFifty/Dashboard/Resources/ResourceList/ResourceUpload'
import ComponentConfig, {
  ComponentConfigProps,
  RemoveButton,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function ResourceItemConfig(
  props: ComponentConfigProps & {
    resource: Resource
    targetIndex?: number
    onClose: () => void
  },
) {
  const {targetIndex, onClose, resource, isVisible} = props
  const template = useNiftyFiftyTemplate()
  const updateTemplate = useNiftyFiftyUpdate()
  const {resourceList: list} = template
  const deleteFile = useDeleteFile()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const {register, handleSubmit, control} = useForm()

  const [rules, setRules] = useState(resource.rules)
  const [isUrl, setIsUrl] = useState(resource.isUrl)
  const [filePath, setFilePath] = useState(resource.filePath)

  const isEditing = targetIndex !== undefined

  useEffect(() => {
    if (!isVisible && ruleConfigVisible) {
      toggleRuleConfig()
    }
  }, [isVisible, toggleRuleConfig, ruleConfigVisible])

  const insert = (resource: Resource) => {
    return {
      resourceList: {
        resources: [...list.resources, resource],
      },
    }
  }

  const update = (resource: Resource) => {
    return {
      resourceList: {
        resources: list.resources.map((r, index) => {
          const isTarget = index === targetIndex
          if (isTarget) {
            return resource
          }

          return r
        }),
      },
    }
  }

  const save = (form: any) => {
    const data: Resource = {
      rules,
      isUrl,
      filePath,
      ...form,
    }

    const updated = targetIndex === undefined ? insert(data) : update(data)

    updateTemplate(updated)

    onClose()
  }

  const remove = () => {
    if (targetIndex === undefined) {
      throw new Error('Missing resource item index')
    }

    if (resource.filePath) {
      deleteFile(resource.filePath).catch((e) => {
        // Log error, but prevent it from crashing app
        console.error(e)
      })
    }
    onClose()

    updateTemplate({
      resourceList: {
        resources: list.resources.filter(
          (_, index) => index !== props.targetIndex,
        ),
      },
    })
  }

  return (
    <ComponentConfig
      title="Resource"
      onClose={props.onClose}
      isVisible={isVisible}
    >
      <RuleConfig
        visible={ruleConfigVisible}
        close={toggleRuleConfig}
        rules={rules}
        onChange={setRules}
      >
        <>
          <ConfigureRulesButton onClick={toggleRuleConfig} />
          <form onSubmit={handleSubmit(save)}>
            <FormControl>
              <Controller
                name="isVisible"
                control={control}
                defaultValue={resource.isVisible || false}
                render={({value, onChange}) => (
                  <Switch
                    checked={value}
                    onChange={onChangeCheckedHandler(onChange)}
                    arial-label="toggle reseource"
                    labelPlacement="end"
                    color="primary"
                    label="Enabled"
                  />
                )}
              />
            </FormControl>
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
              <ToggleButtonGroup value={isUrl ? 'true' : 'false'} exclusive>
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

            <TextField
              name="description"
              defaultValue={resource.description}
              inputProps={{
                'aria-label': 'resource description',
                ref: register,
              }}
              label="Description"
              fullWidth
              rows={4}
              multiline
            />
            <TextField
              name="linkText"
              defaultValue={resource.linkText}
              inputProps={{
                'aria-label': 'resource link text',
                ref: register,
              }}
              label="Link Text"
              fullWidth
            />
            <SaveButton />
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
