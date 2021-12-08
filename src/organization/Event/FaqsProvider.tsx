import {useEvent} from 'Event/EventProvider'
import {FAQ, useFetchFaqs} from 'Event/FaqPage'
import {useOrganization} from 'organization/OrganizationProvider'
import {Client} from 'lib/ui/api-client'
import React, {useEffect, useState} from 'react'

interface FaqsContextProps {
  faqs: FAQ[]
  add: (faq: FAQ) => void
  update: (faq: FAQ) => void
  remove: (faq: FAQ) => void
  edit: (faq: FAQ | null) => void
  loading: boolean
  editing: FAQ | null
}

const FaqsContext = React.createContext<undefined | FaqsContextProps>(undefined)

export function OrganizationFaqsProvider(props: {children: React.ReactNode}) {
  const {client} = useOrganization()
  return <FaqsProvider client={client} {...props} />
}

export function EventFaqsProvider(props: {children: React.ReactNode}) {
  const {client} = useEvent()
  return <FaqsProvider client={client} {...props} />
}

export default function FaqsProvider(props: {
  client: Client
  children: React.ReactNode
}) {
  const {client} = props
  const {data: saved, loading} = useFetchFaqs(client)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [editing, setEditing] = useState<FAQ | null>(null)

  const edit = (faq: FAQ | null) => setEditing(faq)

  useEffect(() => {
    if (!saved) {
      return
    }

    setFaqs(saved)
  }, [saved])

  const add = (newFaq: FAQ) => {
    const added = [...faqs, newFaq]
    setFaqs(added)
  }

  const update = (target: FAQ) => {
    const updated = faqs.map((s) => {
      const isTarget = s.id === target.id
      if (isTarget) {
        return target
      }

      return s
    })

    setFaqs(updated)
  }

  const remove = (target: FAQ) => {
    const removed = faqs.filter((f) => f.id !== target.id)
    setFaqs(removed)
  }

  return (
    <FaqsContext.Provider
      value={{
        faqs,
        add,
        update,
        remove,
        loading,
        edit,
        editing,
      }}
    >
      {props.children}
    </FaqsContext.Provider>
  )
}

export function useFaqs() {
  const context = React.useContext(FaqsContext)

  if (context === undefined) {
    throw new Error('useFaqs must be used within a FaqsProvider')
  }

  return context
}
