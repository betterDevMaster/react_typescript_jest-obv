import {Rule} from 'Dashboard/component-rules/sources'
import styled from 'styled-components'
import React, {useState} from 'react'
import RuleComponent from 'Dashboard/component-rules/RulesConfig/RuleList/SingleRule'
import BackButton from 'Dashboard/component-rules/RulesConfig/BackButton'
import MuiButton from '@material-ui/core/Button'
import RuleForm from 'Dashboard/component-rules/RulesConfig/RuleList/RuleForm'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import {withStyles} from '@material-ui/core'

export default function RuleList(props: {
  rules: Rule[]
  close: () => void
  onChange: (rules: Rule[]) => void
}) {
  const [ruleConfigVisible, setRuleConfigVisible] = useState(false)
  const toggleRuleConfig = () => setRuleConfigVisible(!ruleConfigVisible)
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number | null>(
    null,
  )
  const rule =
    selectedRuleIndex !== null ? props.rules[selectedRuleIndex] : null

  const addNewRule = () => {
    setSelectedRuleIndex(null)
    toggleRuleConfig()
  }

  const editRule = (index: number) => {
    setSelectedRuleIndex(index)
    toggleRuleConfig()
  }

  const createRule = (rule: Rule) => {
    const updated = [...props.rules, rule]
    props.onChange(updated)
    toggleRuleConfig()
  }

  const updateRule = (index: number, rule: Rule) => {
    const updated = props.rules.map((r, i) => (i === index ? rule : r))
    props.onChange(updated)
    setRuleConfigVisible(false)
  }

  const saveRule = (rule: Rule) => {
    if (selectedRuleIndex !== null) {
      updateRule(selectedRuleIndex, rule)
    } else {
      createRule(rule)
    }
  }

  const deleteRule = () => {
    toggleRuleConfig()
    const removed = props.rules.filter((_, i) => i !== selectedRuleIndex)
    props.onChange(removed)
  }

  if (ruleConfigVisible) {
    return (
      <RuleForm
        close={toggleRuleConfig}
        onDelete={deleteRule}
        onCreate={saveRule}
        rule={rule}
      />
    )
  }

  return (
    <Box>
      <StyledBackButton onClick={props.close} />
      <Rules
        rules={props.rules}
        onEditRule={editRule}
        updateRule={updateRule}
      />
      <MuiButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={addNewRule}
      >
        Add Rule
      </MuiButton>
    </Box>
  )
}

function Rules(props: {
  rules: Rule[]
  updateRule: (index: number, rule: Rule) => void
  onEditRule: (index: number) => void
}) {
  const hasRules = props.rules.length > 0

  if (!hasRules) {
    return <EmptyRulesText>No rules have been added</EmptyRulesText>
  }

  const updateAtIndex = (index: number) => (rule: Rule) =>
    props.updateRule(index, rule)

  return (
    <RulesContainer>
      <RulesDescription>Component will be hidden when </RulesDescription>
      {props.rules.map((rule, index) => (
        <StyledRule
          key={index}
          rule={rule}
          isFirstRule={index === 0}
          onUpdate={updateAtIndex(index)}
          onEdit={() => props.onEditRule(index)}
        />
      ))}
    </RulesContainer>
  )
}

const Box = styled.div`
  padding-bottom: ${(props) => props.theme.spacing[4]};
`

const RulesContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`

const StyledBackButton = styled(BackButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
const EmptyRulesText = styled.p`
  margin: ${(props) => props.theme.spacing[4]} 0;
  text-align: center;
`

const StyledRule = styled(RuleComponent)`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const RulesDescription = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
