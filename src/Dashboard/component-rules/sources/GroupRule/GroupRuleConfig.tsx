import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import {RuleConfigProps} from 'Dashboard/component-rules/RulesConfig/RuleList/RuleForm/SourceConfig'
import {Rule} from 'Dashboard/component-rules/sources'
import {
  createGroupRule,
  IS_NOT,
  GROUP,
  GroupRule,
  IS,
} from 'Dashboard/component-rules/sources/GroupRule/group-rule'
import {onChangeStringHandler, onUnknownChangeHandler} from 'lib/dom'
import React, {useEffect, useState} from 'react'

export default function GroupRuleConfig(props: RuleConfigProps) {
  const [key, setKey] = useState<GroupRule['key']>(initialKey(props.rule))
  const [type, setType] = useState<GroupRule['type']>(initialType(props.rule))
  const [target, setTarget] = useState<GroupRule['target']>(
    initialTarget(props.rule),
  )

  const {onSet} = props

  useEffect(() => {
    const isValid = type && key && target
    const rule = isValid ? createGroupRule(type, key, target) : null
    onSet(rule)
  }, [type, key, target, onSet])

  return (
    <>
      <TextField
        fullWidth
        placeholder="Key"
        inputProps={{
          'aria-label': 'new group key',
        }}
        value={key}
        onChange={onChangeStringHandler(setKey)}
      />
      <FormControl fullWidth>
        <Select
          value={type}
          fullWidth
          onChange={onUnknownChangeHandler(setType)}
        >
          <MenuItem value={IS}>{IS}</MenuItem>
          <MenuItem value={IS_NOT}>{IS_NOT}</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        placeholder="Target"
        inputProps={{
          'aria-label': 'new group target',
        }}
        value={target}
        onChange={onChangeStringHandler(setTarget)}
      />
    </>
  )
}

function initialType(rule: Rule | null): GroupRule['type'] {
  if (!rule || rule.source !== GROUP) {
    return IS
  }

  return rule.type
}

function initialKey(rule: Rule | null): GroupRule['key'] {
  if (!rule || rule.source !== GROUP) {
    return 'group'
  }

  return rule.key
}

function initialTarget(rule: Rule | null): GroupRule['target'] {
  if (!rule || rule.source !== GROUP) {
    return ''
  }

  return rule.target
}
