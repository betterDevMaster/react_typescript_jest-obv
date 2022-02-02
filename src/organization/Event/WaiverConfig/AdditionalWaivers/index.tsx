import React, {useState} from 'react'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import styled from 'styled-components'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import Button from '@material-ui/core/Button'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {WaiverConfig} from 'Event'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {useCallback} from 'react'
import {useOrganization} from 'organization/OrganizationProvider'
import {useAsync} from 'lib/async'
import {useEffect} from 'react'
import {Redirect} from 'react-router'
import AddButton from 'organization/Event/WaiverConfig/AdditionalWaivers/AddButton'
import ConfigDialog from 'organization/Event/WaiverConfig/AdditionalWaivers/ConfigDialog'
import WaiversTable from 'organization/Event/WaiverConfig/AdditionalWaivers/WaiversTable'

export type AdditionalWaiver = WaiverConfig & {
  id: number
}

type AdditionalWaiversContextProps = {
  waivers: AdditionalWaiver[]
  setWaivers: (waivers: AdditionalWaiver[]) => void
  add: (waiver: AdditionalWaiver) => void
  update: (waiver: AdditionalWaiver) => void
  remove: (waiverId: number) => void
}

const AdditionalWaiversContext = React.createContext<
  undefined | AdditionalWaiversContextProps
>(undefined)

export default function AdditionalWaivers() {
  const {hasWaiver} = useEvent()
  const routes = useEventRoutes()

  // If a user hasn't set a default waiver, we'll redirect them back as
  // we require the default to be set.
  if (!hasWaiver) {
    return <Redirect to={routes.waiver.root} />
  }

  return (
    <Layout>
      <Page>
        <Content />
      </Page>
    </Layout>
  )
}

function Content() {
  const [editing, setEditing] = useState<
    AdditionalWaiver | WaiverConfig | null
  >(null)
  const routes = useEventRoutes()
  const {data: saved} = useFetchAdditionalWaivers()

  const [waivers, setWaivers] = useState<AdditionalWaiver[]>([])

  const stopEditing = () => setEditing(null)

  const add = (waiver: AdditionalWaiver) => {
    setWaivers((waivers) => [...waivers, waiver])
  }

  const update = (waiver: AdditionalWaiver) => {
    setWaivers((waivers) =>
      waivers.map((w) => {
        const isTarget = w.id === waiver.id
        if (isTarget) {
          return waiver
        }

        return w
      }),
    )
  }

  const remove = (id: number) => {
    setWaivers((waivers) => waivers.filter((w) => w.id !== id))
  }

  const handleAdd = () => {
    const newWaiver: WaiverConfig = {
      is_enabled: true,
      title: '',
      body: '',
      agree_statement: '',
      signature_prompt: '',
      rules: [],
      form: null,
      priority: waivers.length + 1,
      logo: null,
    }

    setEditing(newWaiver)
  }

  useEffect(() => {
    if (!saved) {
      return
    }

    setWaivers(saved)
  }, [saved])

  if (!saved) {
    return <div>loading...</div>
  }

  return (
    <AdditionalWaiversContext.Provider
      value={{waivers, add, update, setWaivers, remove}}
    >
      <ConfigDialog target={editing} onClose={stopEditing} />
      <Header>
        <RelativeLink disableStyles to={routes.waiver.root}>
          <Button>Back to default waiver</Button>
        </RelativeLink>
        <AddButton onClick={handleAdd} />
      </Header>
      <WaiversTable onClick={setEditing} />
    </AdditionalWaiversContext.Provider>
  )
}

function useFetchAdditionalWaivers() {
  const {event} = useEvent()
  const {client} = useOrganization()

  const url = api(`/events/${event.slug}/additional_waivers`)

  const request = useCallback(() => client.get<AdditionalWaiver[]>(url), [
    url,
    client,
  ])

  return useAsync(request)
}

export function useAdditionalWaivers() {
  const context = React.useContext(AdditionalWaiversContext)
  if (context === undefined) {
    throw new Error(
      'useAdditionalWaivers must be used within AdditionalWaivers.',
    )
  }

  return context
}

const Header = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]};
  display: flex;
  justify-content: space-between;
`
