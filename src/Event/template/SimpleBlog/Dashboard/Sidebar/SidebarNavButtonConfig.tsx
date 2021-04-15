import NavButton from 'Event/Dashboard/components/NavButton'
import DangerButton from 'lib/ui/Button/DangerButton'
import React from 'react'
import Box from '@material-ui/core/Box'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import {SIDEBAR_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import RuleConfig, {
  useRuleConfig,
} from 'Event/Dashboard/component-rules/RuleConfig'
import NavButtonConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig'
import ConfigureRulesButton from 'Event/Dashboard/component-rules/ConfigureRulesButton'

export type SidebarNavButtonConfig = {
  type: typeof SIDEBAR_NAV_BUTTON
  id: string
}

export function SidebarNavButtonConfig(props: {
  id: SidebarNavButtonConfig['id']
}) {
  const {sidebarNav: buttons} = useTemplate()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()
  const {id} = props

  if (!id) {
    throw new Error('Missing component id')
  }

  const button = buttons.entities[id]

  const update = (updated: NavButton) => {
    updateTemplate({
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
    updateTemplate({
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
    <RuleConfig
      visible={ruleConfigVisible}
      close={toggleRuleConfig}
      rules={button.rules}
      onChange={updateButton('rules')}
    >
      <>
        <ConfigureRulesButton onClick={toggleRuleConfig} />
        <NavButtonConfig button={button} onUpdate={update} />
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
    </RuleConfig>
  )
}
