import React, {useCallback, useEffect, useState} from 'react'
import styled from 'styled-components'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import RuleConfig from 'Event/attendee-rules/RuleConfig'
import {useToggle} from 'lib/toggle'
import ComponentConfig from 'organization/Event/DashboardConfig/ComponentConfig'
import Button from '@material-ui/core/Button'
import {Rule} from 'Event/attendee-rules'
import {useSimpleBlogUpdate} from 'Event/template/SimpleBlog'
import {usePrevious} from 'lib/state'

export default function ItemRulesConfig(props: {id: string; rules?: Rule[]}) {
  const {flag: showing, toggle} = useToggle()
  const [rules, setRules] = useState(props.rules || [])
  const updateTemplate = useSimpleBlogUpdate()
  const {id} = props
  const {flag: saved, toggle: toggleSaved} = useToggle()

  const prevShowing = usePrevious(showing)

  const save = useCallback(() => {
    updateTemplate({
      sidebarItems: {
        [id]: {
          rules,
        },
      },
    })
  }, [updateTemplate, rules, id])

  // Auto-save on close
  useEffect(() => {
    // Only save on close
    if (showing) {
      return
    }

    // Check if we've already saved to prevent infinite loop.
    // Not ideal, but the alternative is calculating rule
    // equality which is much harder due to nested rules.
    if (saved) {
      return
    }

    // Skip auto-save on load by checking if it was previously
    // showing. ie. did we close the window?
    if (!prevShowing) {
      return
    }

    save()
    toggleSaved()
  }, [showing, save, toggleSaved, saved, prevShowing])

  const isEditMode = useEditMode()
  if (!isEditMode) {
    return null
  }

  return (
    <>
      <ComponentConfig
        title="Visibility Rules"
        isVisible={showing}
        onClose={toggle}
      >
        <RuleConfig visible rules={rules} onChange={setRules} />
      </ComponentConfig>
      <StyledButton
        variant="outlined"
        color="primary"
        size="small"
        onClick={toggle}
      >
        Rules
      </StyledButton>
    </>
  )
}

const StyledButton = styled(Button)`
  position: absolute;
  right: 0;
  top: ${(props) => props.theme.spacing[2]};
`
