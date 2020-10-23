import {Rule} from 'Dashboard/component-rules/sources'
import styled from 'styled-components'
import React, {useState} from 'react'
import RuleComponent from 'Dashboard/component-rules/RulesConfig/RuleList/SingleRule'
import BackButton from 'Dashboard/component-rules/RulesConfig/BackButton'
import MuiButton from '@material-ui/core/Button'
import NewRuleForm from 'Dashboard/component-rules/RulesConfig/RuleList/NewRuleForm'

export default function RuleList(props: {
  rules: Rule[]
  close: () => void
  onChange: (rules: Rule[]) => void
}) {
  const [newRuleFormVisible, setNewRuleFormVisible] = useState(false)
  const toggleNewRuleForm = () => setNewRuleFormVisible(!newRuleFormVisible)

  const saveNewRule = (rule: Rule) => {
    const updated = [...props.rules, rule]
    props.onChange(updated)
    toggleNewRuleForm()
  }

  if (newRuleFormVisible) {
    return <NewRuleForm close={toggleNewRuleForm} onCreate={saveNewRule} />
  }

  return (
    <Box>
      <BackButton onClick={props.close} />
      <Rules rules={props.rules} />
      <MuiButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={toggleNewRuleForm}
      >
        Add Rule
      </MuiButton>
    </Box>
  )
}

function Rules(props: {rules: Rule[]}) {
  const hasRules = props.rules.length > 0

  if (!hasRules) {
    return <EmptyRulesText>No rules have been added</EmptyRulesText>
  }

  return (
    <div>
      {props.rules.map((rule, index) => (
        <RuleComponent key={index} rule={rule} />
      ))}
    </div>
  )
}

const Box = styled.div`
  padding-bottom: ${(props) => props.theme.spacing[4]};
`

const EmptyRulesText = styled.p`
  margin: ${(props) => props.theme.spacing[4]} 0;
  text-align: center;
`
