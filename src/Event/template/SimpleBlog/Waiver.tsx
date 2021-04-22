import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Signature from 'lib/ui/form/Signature'
import {onChangeCheckedHandler} from 'lib/dom'
import {useWaiver} from 'Event/Step2/WaiverProvider'
import {useWithAttendeeData} from 'Event/auth/data'

export default function Waiver() {
  const {
    waiver,
    agree,
    setAgree,
    agreeLabel,
    signature,
    setSignature,
  } = useWaiver()

  const withAttendeeData = useWithAttendeeData()

  return (
    <>
      <Body
        dangerouslySetInnerHTML={{
          __html: withAttendeeData(waiver.body),
        }}
      />
      <FormControl required component="fieldset">
        <FormControlLabel
          control={
            <Checkbox
              checked={agree}
              onChange={onChangeCheckedHandler(setAgree)}
              inputProps={{
                'aria-label': 'agree to waiver checkbox',
              }}
            />
          }
          label={agreeLabel}
        />
      </FormControl>
      <Signature value={signature} onUpdate={setSignature} />
    </>
  )
}

const Body = styled.div`
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid ${grey[300]};
  padding: 0 ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
