import styled from 'styled-components'
import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Signature from 'lib/ui/form/Signature'
import {onChangeCheckedHandler} from 'lib/dom'
import {useWaiver} from 'Event/Step2/WaiverProvider'
import {useAttendeeVariables} from 'Event'
import Typography from '@material-ui/core/Typography'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import Box from '@material-ui/core/Box'
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

  const {isDarkMode} = useNiftyFiftyTemplate()
  const v = useAttendeeVariables()
  const color = isDarkMode ? '#FFFFFF' : '#000000'

  return (
    <>
      <Body>{v(body)}</Body>
      <Box m={2}>
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
      </Box>
      <StyledTypography>{v(signaturePrompt)}</StyledTypography>
      <StyledSignature value={signature} onUpdate={setSignature} />
    </>
  )
}

const Body = styled(Content)`
  width: 100%;
  border-radius: 10px;
  margin-bottom: ${(props) => props.theme.spacing[4]};
  padding: ${(props) => props.theme.spacing[2]};
  background: #ffffff;
  color: #000000;
`

const StyledCheckBox = styled((props) => {
  const {color: _1, isDarkMode: _2, ...otherProps} = props
  return <Checkbox {...otherProps} />
})<{
  isDarkMode?: boolean
}>`
  color: ${(props) => props.color} !important;
`

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

const StyledSignature = styled(Signature)`
  canvas {
    border: none;
    border-radius: 10px;
  }
`
