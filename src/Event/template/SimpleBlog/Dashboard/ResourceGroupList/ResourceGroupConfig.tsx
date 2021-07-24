import React, {useEffect, useState} from 'react'
import TextField from '@material-ui/core/TextField'
import {ResourceGroup} from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/ResourceGroup'
import DangerButton from 'lib/ui/Button/DangerButton'
import styled from 'styled-components'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import Switch from 'lib/ui/form/Switch'
import {onChangeCheckedHandler} from 'lib/dom'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useDispatchUpdate} from 'Event/TemplateProvider'

import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

import {Controller, useForm} from 'react-hook-form'
import {useDeleteFile} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceUpload'

export function ResourceGroupConfig(
  props: ComponentConfigProps & {
    resourceGroup: ResourceGroup
    index?: number
  },
) {
  const {resourceGroup, index, isVisible, onClose} = props
  const {
    template: {resourceGroupList},
  } = useSimpleBlog()
  const updateTemplate = useDispatchUpdate()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const {register, handleSubmit, control} = useForm()
  const deleteFile = useDeleteFile()
  const group = resourceGroup
  const groups = resourceGroupList?.groups || []

  const [rules, setRules] = useState(group.rules)

  useEffect(() => {
    if (isVisible) {
      return
    }
    setRules(group.rules)
  }, [group, isVisible])

  const save = (formData: any) => {
    const data: ResourceGroup = {
      rules,
      resources: group.resources,
      ...formData,
    }

    if (index === undefined) {
      insert(data)
    } else {
      update(index, data)
    }

    onClose()
  }

  const update = (groupId: number, data: ResourceGroup) => {
    updateTemplate({
      resourceGroupList: {
        groups: groups.map((r, i) => {
          const isTarget = i === groupId
          if (isTarget) {
            return data
          }
          return r
        }),
      },
    })
  }

  const insert = (newResourceGroup: ResourceGroup) => {
    updateTemplate({
      resourceGroupList: {
        groups: [...groups, newResourceGroup],
      },
    })
  }

  const deleteItemUploads = () => {
    for (const resource of resourceGroup.resources) {
      if (!resource.filePath) {
        continue
      }

      deleteFile(resource.filePath).catch((e) => {
        console.error(e)
      })
    }
  }

  const remove = () => {
    const hasItems = resourceGroup.resources.length > 0
    if (hasItems) {
      deleteItemUploads()
    }

    const removedGroups = groups.filter((_, i) => i !== props.index)

    updateTemplate({
      resourceGroupList: {
        groups: removedGroups,
      },
    })

    onClose()
  }

  return (
    <ComponentConfig
      title="Resource Group"
      onClose={onClose}
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
            <Controller
              name="isVisible"
              control={control}
              defaultValue={group.isVisible || false}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  arial-label="config visible switch"
                  labelPlacement="end"
                  color="primary"
                  label={value ? 'Enable' : 'Disable'}
                />
              )}
            />

            <TextField
              name="title"
              defaultValue={group.title}
              inputProps={{
                'aria-label': 'update resource group title',
                ref: register,
              }}
              label="Title"
              fullWidth
            />

            <TextField
              name="description"
              defaultValue={group.description}
              inputProps={{
                'aria-label': 'update resource group description',
                ref: register,
              }}
              label="Description"
              fullWidth
            />
            <SaveButton type="submit" />
            <RemoveButton
              fullWidth
              variant="outlined"
              aria-label="remove resource group"
              onClick={remove}
            >
              REMOVE GROUP
            </RemoveButton>
          </form>
        </>
      </RuleConfig>
    </ComponentConfig>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
