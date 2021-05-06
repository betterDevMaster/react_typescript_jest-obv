import {useEvent} from 'Event/EventProvider'
import {api, storage} from 'lib/url'
import {useContext, useState} from 'react'
import {Attendee} from 'Event/attendee'
import {setUser} from 'auth/actions'
import {useDispatch} from 'react-redux'
import {WaiverConfig} from 'Event'
import React from 'react'
import {useVariables} from 'Event'

interface WaiverContextProps {
  agree: boolean
  submit: () => Promise<void>
  canSubmit: boolean
  setAgree: (agree: boolean) => void
  signature: string | null
  setSignature: (signature: string | null) => void
  waiver: WaiverConfig
  isPreview?: boolean
  agreeStatement: string
}

export const DEFAULT_AGREE_STATEMENT = `I hereby certify that I have read the forgoing and fully understand the meaning effect thereof, and intending to be legally bound, have signed it.`

const WaiverContext = React.createContext<WaiverContextProps | undefined>(
  undefined,
)

export default function WaiverProvider(props: {
  children: React.ReactElement
  waiver: WaiverConfig
  isPreview?: boolean
}) {
  const {waiver, isPreview} = props
  const {event, client} = useEvent()
  const [signature, setSignature] = useState<string | null>(null)
  const [agree, setAgree] = useState(false)
  const dispatch = useDispatch()
  const v = useVariables()
  const canSubmit = Boolean(signature) && Boolean(agree)
  const agreeStatement = v(waiver?.agree_statement || DEFAULT_AGREE_STATEMENT)

  if (!waiver) {
    throw new Error(`Missing event waiver`)
  }

  const submit = () => {
    const url = api(`/events/${event.slug}/waiver/sign`)
    if (isPreview) {
      return Promise.resolve()
    }

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
        agreeStatement,
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
