import {Rule} from 'Event/visibility-rules'
import styled from 'styled-components'
import React from 'react'
import {useState} from 'react'
import RuleList from 'Event/visibility-rules/RuleConfig/RuleList'

export default function RuleConfig(props: {
  children?: React.ReactElement
  visible: boolean
  close?: () => void
  onChange: (rules: Rule[]) => void
  rules?: Rule[]
  description?: string
  className?: string
  disabled?: boolean
}) {
  if (!props.visible) {
    return props.children || null
  }

  return (
    <Box className={props.className}>
      <RuleList
        disabled={props.disabled}
        rules={props.rules}
        close={props.close}
        onChange={props.onChange}
        description={props.description}
      />
    </Box>
  )
}

export function useRuleConfig() {
  const [visible, setVisible] = useState(false)

  const toggle = () => setVisible(!visible)

  return {
    visible,
    toggle,
  }
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`
