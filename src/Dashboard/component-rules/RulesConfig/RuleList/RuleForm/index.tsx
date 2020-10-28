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
import SourceConfig from 'Dashboard/component-rules/RulesConfig/RuleList/RuleForm/SourceConfig'
import {GROUP} from 'Dashboard/component-rules/sources/GroupRule/group-rule'
import {TAGS} from 'Dashboard/component-rules/sources/TagsRule/tags-rule'
import {NESTED_RULE} from 'Dashboard/component-rules/sources/NestedRule/nested-rule'
import DangerButton from 'lib/ui/Button/DangerButton'
import Visible from 'lib/ui/layout/Visible'

const ALL_SOURCES = [TAGS, GROUP, NESTED_RULE]

export default function RuleForm(props: {
  close: () => void
  onCreate: (rule: Rule) => void
  rule: Rule | null
  onDelete: () => void
}) {
  const initialSource = props.rule ? props.rule.source : null
  const initialRule = props.rule || null
  const [source, setSource] = useState<null | Rule['source']>(initialSource)
  const [rule, setRule] = useState<null | Rule>(initialRule)
  const [controlsVisible, setControlsVisible] = useState(true)
  const toggleControlVisibility = () => setControlsVisible(!controlsVisible)
  const showDelete = Boolean(props.rule)

  const save = () => {
    if (!rule) {
      return
    }

    props.onCreate(rule)
  }
  return (
    <Box>
      <Visible when={controlsVisible}>
        <>
          <DeleteRuleButton visible={showDelete} onClick={props.onDelete} />
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
        </>
      </Visible>
      <SourceConfig
        source={source}
        onSet={setRule}
        rule={rule}
        onToggleNestedRule={toggleControlVisibility}
      />
      <Visible when={controlsVisible}>
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
      </Visible>
    </Box>
  )
}

function DeleteRuleButton(props: {visible: boolean; onClick: () => void}) {
  if (!props.visible) {
    return null
  }

  return (
    <StyledDangerButton
      onClick={props.onClick}
      variant="outlined"
      size="small"
      fullWidth
    >
      Delete
    </StyledDangerButton>
  )
}

const Box = styled.div`
  padding-bottom: ${(props) => props.theme.spacing[4]};
`

const StyledDangerButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
`
