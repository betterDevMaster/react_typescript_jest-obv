import {Select} from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl/FormControl'
import MenuItem from '@material-ui/core/MenuItem/MenuItem'
import TextField from '@material-ui/core/TextField/TextField'
import {
  createTagsRule,
  DOES_NOT_INCLUDE,
  INCLUDES,
  TagsRule,
} from 'Dashboard/component-rules/sources/TagsRule/tags-rule'
import {RuleConfigProps} from 'Dashboard/component-rules/RulesConfig/RuleList/NewRuleForm/SourceConfig'
import {onChangeStringHandler, onUnknownChangeHandler} from 'lib/dom'
import React, {useEffect, useState} from 'react'

export default function TagsRuleConfig(props: RuleConfigProps) {
  const [type, setType] = useState<TagsRule['type']>(INCLUDES)
  const [target, setTarget] = useState('')
  const {onSet} = props

  useEffect(() => {
    const isValid = type && Boolean(target)
    const rule = isValid ? createTagsRule(type, target) : null
    onSet(rule)
  }, [type, target, onSet])

  return (
    <div>
      <FormControl fullWidth>
        <Select
          value={type}
          fullWidth
          onChange={onUnknownChangeHandler(setType)}
        >
          <MenuItem value={INCLUDES}>{INCLUDES}</MenuItem>
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
    </div>
  )
}
