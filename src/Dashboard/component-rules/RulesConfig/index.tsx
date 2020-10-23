import {Rule} from 'Dashboard/component-rules/sources'
import React from 'react'
import {useState} from 'react'
import RuleList from 'Dashboard/component-rules/RulesConfig/RuleList'

export default function RulesConfig(props: {
  children: React.ReactElement
  visible: boolean
  close: () => void
  onChange: (rules: Rule[]) => void
  rules: Rule[]
}) {
  if (!props.visible) {
    return props.children
  }

  return (
    <RuleList
      rules={props.rules}
      close={props.close}
      onChange={props.onChange}
    />
  )
}

export function useRulesConfig() {
  const [visible, setVisible] = useState(false)

  const toggle = () => setVisible(!visible)

  return {
    visible,
    toggle,
  }
}
