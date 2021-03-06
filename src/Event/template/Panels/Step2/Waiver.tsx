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
import Box from '@material-ui/core/Box'

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

  const v = useAttendeeVariables()
  const color = '#000000'

  return (
    <>
      <Body
        dangerouslySetInnerHTML={{
          __html: v(body),
        }}
      />
      <Box mb={2}>
        <FormControl required component="fieldset">
          <FormControlLabel
            control={
              <StyledCheckBox
                color={color}
                checked={agree}
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
      <Typography>{v(signaturePrompt)}</Typography>
      <StyledSignature value={signature} onUpdate={setSignature} />
    </>
  )
}

const Body = styled.div`
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  background: #ffffff;
  color: #000000;
`

const StyledCheckBox = styled((props) => {
  const {color: _1, ...otherProps} = props
  return <Checkbox {...otherProps} />
})`
  color: ${(props) => props.color} !important;
`

const StyledSignature = styled(Signature)`
  canvas {
    border: none;
    border-radius: 10px;
  }
`
