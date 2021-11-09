import React from 'react'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureSkipTechCheckRulesButton from 'Event/template/SimpleBlog/Step3/TechCheckConfig/SkipTechCheckRulesConfig/ConfigureSkipTechCheckRulesButton'
import {Rule} from 'Event/attendee-rules'

export default function SkipTechCheckRulesConfig(props: {
  children: React.ReactElement
  rules: Rule[]
  onChange: (rules: Rule[]) => void
}) {
  const {visible: configShowing, toggle: toggleConfig} = useRuleConfig()

  return (
    <>
      <ConfigureSkipTechCheckRulesButton onClick={toggleConfig} />
      <RuleConfig
        visible={configShowing}
        rules={props.rules}
        onChange={props.onChange}
        description="Tech Check will be skipped when the following rules match:"
      />
      {props.children}
    </>
  )
}
