import {useToggle} from 'lib/toggle'
import RoomsConfigDialog from 'organization/Event/Area/Rules/RulesTable/RoomsConfig/RoomsConfigDialog'
import React from 'react'
import {Rule, useRules} from 'organization/Event/Area/Rules/RulesProvider'
import Clickable from 'lib/ui/Clickable'

export default function RoomsConfig(props: {
  children: React.ReactElement
  rule: Rule
}) {
  const {flag: showing, toggle} = useToggle()
  const {processing} = useRules()

  return (
    <>
      <RoomsConfigDialog showing={showing} onClose={toggle} rule={props.rule} />
      <Clickable
        onClick={toggle}
        disabled={processing}
        aria-label="select rooms"
      >
        {props.children}
      </Clickable>
    </>
  )
}
