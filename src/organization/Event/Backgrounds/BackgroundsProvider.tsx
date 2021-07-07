import React, {useCallback, useEffect, useState} from 'react'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {HasRules} from 'Event/visibility-rules'
import {useAsync} from 'lib/async'
import {useOrganization} from 'organization/OrganizationProvider'
import {useBlocking} from 'lib/requests'

export type Background = {
  id: number
  image: {
    name: string
    url: string
  }
  settings: HasRules | null
  event_id: number
  created_at: string
  updated_at: string
}

interface BackgroundsContextProps {
  backgrounds: Background[]
  upload: (image: File) => Promise<any>
  update: (background: Background, data: Partial<Background>) => Promise<any>
  remove: (background: Background) => Promise<any>
  busy: boolean
  loading: boolean
}

const BackgroundsContext = React.createContext<
  BackgroundsContextProps | undefined
>(undefined)

export default function BackgroundsProvider(props: {
  children: React.ReactElement
}) {
  const [backgrounds, setBackgrounds] = useState<Background[]>([])
  const {data: saved, loading} = useSavedBackgrounds()
  const {blocking, busy} = useBlocking()
  const {client} = useOrganization()
  const {event, set: setEvent} = useEvent()

  useEffect(() => {
    if (!saved) {
      return
    }

    setBackgrounds(saved)
  }, [saved])

  /**
   * Update event on background changes. This is required for
   * sections that require the current backgrounds. ie. in
   * dashboard configs that contain backgrounds.
   */
  useEffect(() => {
    const sameNumBackgrounds = event.backgrounds.length === backgrounds.length
    const hasNewBackgrounds =
      backgrounds.filter((b) => !event.backgrounds.find((eb) => eb.id === b.id))
        .length > 0

    if (sameNumBackgrounds && !hasNewBackgrounds) {
      return
    }

    const updatedEvent = {
      ...event,
      backgrounds,
    }

    setEvent(updatedEvent)
  }, [backgrounds, setEvent, event])

  const upload = blocking((image: File) => {
    const formData = new FormData()
    formData.set('image', image)

    return client
      .post<Background>(api(`/events/${event.slug}/backgrounds`), formData)
      .then((background) => {
        const added = [...backgrounds, background]
        setBackgrounds(added)
      })
  })

  const update = blocking((background: Background, data: Partial<Background>) =>
    client
      .put<Background>(api(`/backgrounds/${background.id}`), data)
      .then((target) => {
        const updated = backgrounds.map((b) => {
          const isTarget = b.id === target.id

          if (!isTarget) {
            return b
          }

          return target
        })

        setBackgrounds(updated)
      }),
  )

  const remove = blocking((target: Background) =>
    client.delete(api(`/backgrounds/${target.id}`)).then(() => {
      const removed = backgrounds.filter((b) => b.id !== target.id)
      setBackgrounds(removed)
    }),
  )

  return (
    <BackgroundsContext.Provider
      value={{
        backgrounds,
        upload,
        update,
        remove,
        busy,
        loading,
      }}
    >
      {props.children}
    </BackgroundsContext.Provider>
  )
}

export function useBackgrounds() {
  const context = React.useContext(BackgroundsContext)

  if (context === undefined) {
    throw new Error('useBackgrounds must be used within a BackgroundsProvider')
  }

  return context
}

function useSavedBackgrounds() {
  const {
    event: {slug},
  } = useEvent()
  const {client} = useOrganization()

  const request = useCallback(() => {
    const url = api(`/events/${slug}/backgrounds`)
    return client.get<Background[]>(url)
  }, [slug, client])

  return useAsync(request)
}

export function useSortBackgrounds(
  ids: number[] = [],
  backgrounds: Background[],
) {
  return backgrounds.sort((a, b) => {
    const aPosition = ids.indexOf(a.id)
    const bPosition = ids.indexOf(b.id)

    if (aPosition < bPosition) {
      return -1
    }

    if (aPosition > bPosition) {
      return 1
    }

    // Index not found, any order is fine
    return 0
  })
}
