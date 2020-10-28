import {Select} from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl/FormControl'
import MenuItem from '@material-ui/core/MenuItem/MenuItem'
import TextField from '@material-ui/core/TextField/TextField'
import {
  createTagsRule,
  DOES_NOT_INCLUDE,
  INCLUDE,
  TAGS,
  TagsRule,
} from 'Dashboard/component-rules/sources/TagsRule/tags-rule'
import {RuleConfigProps} from 'Dashboard/component-rules/RulesConfig/RuleList/RuleForm/SourceConfig'
import {onChangeStringHandler, onUnknownChangeHandler} from 'lib/dom'
import React, {useEffect, useState} from 'react'
import {Rule} from 'Dashboard/component-rules/sources'

export default function TagsRuleConfig(props: RuleConfigProps) {
  const [type, setType] = useState<TagsRule['type']>(initialType(props.rule))
  const [target, setTarget] = useState(initialTarget(props.rule))
  const {onSet} = props

  useEffect(() => {
    const isValid = type && Boolean(target)
    const rule = isValid ? createTagsRule(type, target) : null
    onSet(rule)
  }, [type, target, onSet])

  return (
    <>
      <FormControl fullWidth>
        <Select
          value={type}
          fullWidth
          onChange={onUnknownChangeHandler(setType)}
        >
          <MenuItem value={INCLUDE}>{INCLUDE}</MenuItem>
          <MenuItem value={DOES_NOT_INCLUDE}>{DOES_NOT_INCLUDE}</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        placeholder="Value"
        inputProps={{
          'aria-label': 'new tag target',
        }}
        value={target}
        onChange={onChangeStringHandler(setTarget)}
      />
    </>
  )
}

function initialType(rule: Rule | null) {
  if (!rule || rule.source !== TAGS) {
    return INCLUDE
  }

  return rule.type
}

function initialTarget(rule: Rule | null) {
  if (!rule || rule.source !== TAGS) {
    return ''
  }

  return rule.target
}
