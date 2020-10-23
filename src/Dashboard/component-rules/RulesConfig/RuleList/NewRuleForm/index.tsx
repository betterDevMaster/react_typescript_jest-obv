import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import React, {useState} from 'react'
import {Rule} from 'Dashboard/component-rules/sources'
import {onUnknownChangeHandler} from 'lib/dom'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import SourceConfig from 'Dashboard/component-rules/RulesConfig/RuleList/NewRuleForm/SourceConfig'
import {GROUP} from 'Dashboard/component-rules/sources/GroupRule/group-rule'
import {TAGS} from 'Dashboard/component-rules/sources/TagsRule/tags-rule'
import {NESTED_RULE} from 'Dashboard/component-rules/sources/NestedRule/nested-rule'

const ALL_SOURCES = [TAGS, GROUP, NESTED_RULE]

export default function NewRuleForm(props: {
  close: () => void
  onCreate: (rule: Rule) => void
}) {
  const [source, setSource] = useState<null | Rule['source']>(null)
  const [rule, setRule] = useState<null | Rule>(null)

  const save = () => {
    if (!rule) {
      return
    }

    props.onCreate(rule)
  }
  return (
    <Box>
      <Typography paragraph>Hide component when</Typography>
      <FormControl fullWidth>
        <Select
          value={source || ''}
          fullWidth
          onChange={onUnknownChangeHandler(setSource)}
          label="Source"
        >
          {Object.values(ALL_SOURCES).map((source) => (
            <MenuItem key={source} value={source}>
              {source}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <SourceConfig source={source} onSet={setRule} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button onClick={props.close} fullWidth>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button color="primary" fullWidth disabled={!rule} onClick={save}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

const Box = styled.div`
  padding-bottom: ${(props) => props.theme.spacing[4]};
`
