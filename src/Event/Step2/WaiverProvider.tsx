import {useEvent} from 'Event/EventProvider'
import {api, storage} from 'lib/url'
import {useContext, useState} from 'react'
import {useAttendee} from 'Event/auth'
import {Attendee} from 'Event/attendee'
import {setUser} from 'auth/actions'
import {useDispatch} from 'react-redux'
import {WaiverConfig} from 'Event'
import React from 'react'

interface WaiverContextProps {
  agree: boolean
  submit: () => Promise<void>
  canSubmit: boolean
  setAgree: (agree: boolean) => void
  signature: string | null
  setSignature: (signature: string | null) => void
  waiver: WaiverConfig
  agreeLabel: string
}

const WaiverContext = React.createContext<WaiverContextProps | undefined>(
  undefined,
)

export default function WaiverProvider(props: {children: React.ReactElement}) {
  const {event, client} = useEvent()
  const {waiver} = event
  const attendee = useAttendee()
  const [signature, setSignature] = useState<string | null>(null)
  const [agree, setAgree] = useState(false)
  const dispatch = useDispatch()

  const canSubmit = Boolean(signature) && Boolean(agree)
  const agreeLabel = `I ${attendee.first_name} ${attendee.last_name} hereby certify that I have read the forgoing and fully understand the meaning effect thereof, and intending to be legally bound, have signed it. *`

  if (!waiver) {
    throw new Error(`Missing event waiver`)
  }

  const submit = () => {
    const url = api(`/events/${event.slug}/waiver/sign`)
    return client
      .post<Attendee>(url, {
        signature,
      })
      .then((attendee) => {
        dispatch(setUser(attendee))
      })
  }

  return (
    <WaiverContext.Provider
      value={{
        agree,
        submit,
        canSubmit,
        setAgree,
        signature,
        setSignature,
        waiver,
        agreeLabel,
      }}
    >
      {props.children}
    </WaiverContext.Provider>
  )
}

export function useWaiver() {
  const context = useContext(WaiverContext)

  if (context === undefined) {
    throw new Error('useWaiver must be used within a WaiverProvider')
  }

  return context
}

export const waiverLogoPath = (logo: string) =>
  storage(`/event/waiver/logo/${logo}`)
