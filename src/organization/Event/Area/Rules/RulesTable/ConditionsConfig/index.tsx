import {useToggle} from 'lib/toggle'
import ConditionsConfigDialog from 'organization/Event/Area/Rules/RulesTable/ConditionsConfig/ConditionsConfigDialog'
import React from 'react'
import {Rule, useRules} from 'organization/Event/Area/Rules/RulesProvider'
import Clickable from 'lib/ui/Clickable'

export default function ConditionsConfig(props: {
  children: React.ReactElement
  rule: Rule
}) {
  const {flag: showing, toggle} = useToggle()
  const {processing} = useRules()

  return (
    <>
      <ConditionsConfigDialog
        showing={showing}
        onClose={toggle}
        rule={props.rule}
      />
      <Clickable
        onClick={toggle}
        disabled={processing}
        aria-label="edit conditions"
      >
        {props.children}
      </Clickable>
    </>
  )
}
