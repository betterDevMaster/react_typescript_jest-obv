import React, {useCallback} from 'react'
import TextField from '@material-ui/core/TextField'
import {ResourceGroup} from 'Event/template/Panels/Dashboard/ResourceGroupList/ResourceGroup'
import DangerButton from 'lib/ui/Button/DangerButton'
import styled from 'styled-components'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import Switch from 'lib/ui/form/Switch'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import {usePanels} from 'Event/template/Panels'

export default function ResourceGroupConfig(props: {
  onClose: () => void
  groupId: number | null
}) {
  if (props.groupId === null) {
    return null
  }
  return <Content onClose={props.onClose} id={props.groupId} />
}

function Content(props: {onClose: () => void; id: number}) {
  const {template, update: updateResourceGroup} = usePanels()
  const groups = template.resourceGroupList

  const updateTemplate = updateResourceGroup.primitive('resourceGroupList')
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  const group = groups.resourceGroups[props.id]

  const update = useCallback(
    <T extends keyof ResourceGroup>(key: T) =>
      (value: ResourceGroup[T]) => {
        const updated = {
          ...group,
          [key]: value,
        }

        updateTemplate({
          resourceGroups: groups.resourceGroups.map((r, index) => {
            const isTarget = index === props.id
            if (isTarget) {
              return updated
            }
            return r
          }),
        })
      },
    [groups.resourceGroups, group, props.id, updateTemplate],
  )

  const remove = () => {
    const removedGroups = groups.resourceGroups.filter(
      (tr, index) => index !== props.id,
    )
    props.onClose()

    updateTemplate({
      resourceGroups: removedGroups,
    })
  }

  return (
    <Dialog onClose={props.onClose} open={true}>
      <DialogTitle>Resource Group</DialogTitle>
      <DialogContent>
        <RuleConfig
          visible={ruleConfigVisible}
          close={toggleRuleConfig}
          rules={group.rules}
          onChange={update('rules')}
        >
          <>
            <ConfigureRulesButton onClick={toggleRuleConfig} />
            <Switch
              checked={group.isVisible}
              onChange={onChangeCheckedHandler(update('isVisible'))}
              arial-label="config visible switch"
              labelPlacement="end"
              color="primary"
              label={group.isVisible ? 'Enable' : 'Disable'}
            />

            <TextField
              value={group.title || ''}
              inputProps={{
                'aria-label': 'update resource group title',
              }}
              label="Title"
              fullWidth
              onChange={onChangeStringHandler(update('title'))}
            />

            <TextField
              value={group.description || ''}
              inputProps={{
                'aria-label': 'update resource group description',
              }}
              label="Description"
              fullWidth
              onChange={onChangeStringHandler(update('description'))}
            />
            <ColorPicker
              label="Resource Group Card Background Color"
              color={group.cardBackgroundColor}
              onPick={update('cardBackgroundColor')}
              aria-label="resource group card background color"
            />

            <RemoveButton
              fullWidth
              variant="outlined"
              aria-label="remove resource group"
              onClick={remove}
            >
              REMOVE GROUP
            </RemoveButton>
          </>
        </RuleConfig>
      </DialogContent>
    </Dialog>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
