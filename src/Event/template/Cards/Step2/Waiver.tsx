import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Signature from 'lib/ui/form/Signature'
import {onChangeCheckedHandler} from 'lib/dom'
import {useWaiver} from 'Event/Step2/WaiverProvider'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import {useAttendeeVariables} from 'Event'
import Typography from '@material-ui/core/Typography'
import {useCards} from 'Event/template/Cards'
import Content from 'lib/ui/form/TextEditor/Content'

export default function Waiver() {
  const {
    agree,
    setAgree,
    agreeStatement,
    signaturePrompt,
    signature,
    setSignature,
    body,
  } = useWaiver()

  const {template} = useCards()
  const {isDarkMode} = template
  const v = useAttendeeVariables()
  const color = template.waiver.checkBoxColor

  return (
    <>
      <Body>{body}</Body>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <FormControl required component="fieldset">
            <FormControlLabel
              control={
                <StyledCheckBox
                  color={color}
                  checked={agree}
                  isDarkMode={isDarkMode}
                  onChange={onChangeCheckedHandler(setAgree)}
                  inputProps={{
                    'aria-label': 'agree to waiver checkbox',
                  }}
                />
              }
              label={v(agreeStatement)}
            />
          </FormControl>
        </Grid>
        <Grid item md={12} xs={12}>
          <Box display="flex" justifyContent="center" m={1}>
            <Typography variant="inherit">{v(signaturePrompt)}</Typography>
          </Box>
          <Box display="flex" justifyContent="center" m={1}>
            <Signature value={signature} onUpdate={setSignature} />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

const Body = styled(Content)`
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid ${grey[300]};
  padding: 0 ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  border-radius: ${(props) => props.theme.spacing[3]};
  background-color: #efefef;
`

const StyledCheckBox = styled((props) => {
  const {color, isDarkMode, ...otherProps} = props
  return <Checkbox {...otherProps} />
})<{
  isDarkMode?: boolean
}>`
  color: ${(props) => props.color} !important;
`
