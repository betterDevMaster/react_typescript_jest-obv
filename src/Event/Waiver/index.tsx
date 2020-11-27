import {useEvent} from 'Event/EventProvider'
import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import {api, storage} from 'lib/url'
import React, {useState} from 'react'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import {useAttendee} from 'Event/auth'
import Signature from 'Event/Waiver/Signature'
import Button from '@material-ui/core/Button'
import {onChangeCheckedHandler} from 'lib/dom'
import {Attendee} from 'Event/attendee'
import {setUser} from 'auth/actions'
import {useDispatch} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {eventRoutes} from 'Event/Routes'

export default function Waiver() {
  const {event, client} = useEvent()
  const {waiver} = event
  const attendee = useAttendee()
  const [signature, setSignature] = useState<string | null>(null)
  const [agree, setAgree] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()

  const canSubmit = Boolean(signature) && Boolean(agree) && !submitting
  const alreadySigned = Boolean(attendee.waiver)

  if (!waiver) {
    throw new Error(`Missing event waiver`)
  }

  if (alreadySigned) {
    return <Redirect to={eventRoutes.root} />
  }

  const label = `I ${attendee.first_name} ${attendee.last_name} hereby certify that I have read the forgoing and fully understand the meaning effect thereof, and intending to be legally bound, have signed it. *`

  const submit = () => {
    setSubmitting(true)
    const url = api(`/events/${event.slug}/waiver/sign`)
    client
      .post<Attendee>(url, {
        signature,
      })
      .then((attendee) => {
        dispatch(setUser(attendee))
      })
      .catch(() => {
        setSubmitting(false)
      })
  }

  return (
    <Container maxWidth="sm">
      <Title>{event.name} Waiver</Title>
      <Body
        dangerouslySetInnerHTML={{
          __html: waiver.body,
        }}
      />
      <FormControl required component="fieldset">
        <FormControlLabel
          control={
            <Checkbox
              checked={agree}
              onChange={onChangeCheckedHandler(setAgree)}
            />
          }
          label={label}
        />
      </FormControl>
      <Signature value={signature} onUpdate={setSignature} />
      <div>
        <Button
          variant="contained"
          color="primary"
          disabled={!canSubmit}
          onClick={submit}
        >
          Submit
        </Button>
      </div>
    </Container>
  )
}

export const waiverLogoPath = (logo: string) =>
  storage(`/event/waiver/logo/${logo}`)

const Body = styled.div`
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid ${grey[300]};
  padding: 0 ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

const Title = styled.h3`
  text-align: center;
`
