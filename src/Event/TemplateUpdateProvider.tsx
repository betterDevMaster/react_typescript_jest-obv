import {Template} from 'Event/template'
import {flatten} from 'lib/object'
import {DeepPartialSubstitute} from 'lib/type-utils'
import React, {useState, useCallback, useEffect, useMemo} from 'react'
import setAtPath from 'lodash/set'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {ObvioEvent} from 'Event'
import {useEventSocket} from 'organization/Event/EventSocketProvider'
import moment from 'moment'
import {useDispatch} from 'react-redux'
import {setIsConnected} from 'Event/Dashboard/editor/state/actions'

// Updated template event broadcasted by Laravel via
// Pusher
const UPDATED_TEMPLATE = '.template.updated'

// Updated data sent via Pusher to notify other users of any updates
type TemplateUpdate = {
  updated_at: string
  template: KeyPaths
}

// When we want the server to remove a key, we'll set it to a
// specific remove value.
export const REMOVE = '__REMOVE__'

type TemplateUpdateType<T extends Template> = (
  updates: DeepPartialSubstitute<T, typeof REMOVE>,
) => void

const TemplateUpdateContext = React.createContext<
  TemplateUpdateType<Template> | undefined
>(undefined)

// A dictionary of the updated template keys, and their
// respective values.
type KeyPaths = Record<string, any>

export default function TemplateUpdateProvider(props: {
  children: (template: Template) => React.ReactElement
  template: Template
}) {
  const [template, setTemplate] = useState(props.template)
  const save = useSave()

  const {channel} = useEventSocket()
  const dispatch = useDispatch()

  // Updates are a dictionary of all successful property updates,
  // and their respective timestamps.
  const updates: Record<string, string> = useMemo(() => ({}), [])

  // Filter update data to only return keys that are NEWER than any updates
  // we've alredy saved. This prevents any flickering we may see if our
  // save went through, but an older update comes through after.
  const onlyNewUpdates = useCallback(
    (data: TemplateUpdate) =>
      Object.entries(data.template).reduce((acc, [key, val]) => {
        const lastSaved = updates[key]
        if (!lastSaved) {
          acc[key] = val
          return acc
        }

        const lastSavedTime = moment(lastSaved)
        const updateTime = moment(data.updated_at)
        const isNewer = updateTime.isAfter(lastSavedTime)

        // We already have a save that should be newer than this, so
        // let's ignore it.
        if (!isNewer) {
          return acc
        }

        acc[key] = val
        return acc
      }, {} as KeyPaths),
    [updates],
  )

  // Since the last write wins, we'll record the timestamp on any successful save.
  // This way if any updates via Pusher come in for previous saves, we can
  // safely ignore, knowing our saved value will eventually arrive.
  const recordUpdates = useCallback(
    (lastSaved: string, keyPaths: KeyPaths) => {
      for (const key of Object.keys(keyPaths)) {
        updates[key] = lastSaved
      }
    },
    [updates],
  )

  // Set the values in the template for the given keypaths.
  const set = useCallback(
    (keyPaths: KeyPaths) => {
      // We're using lodash's _.set() func here which unfortunately is a
      // mutating function, so we'll need to clone the template before
      // modifying it to avoid potential shared state bugs.
      const updated = {...template}

      for (const [keyPath, val] of Object.entries(keyPaths)) {
        setAtPath(updated, keyPath, val)
      }

      setTemplate(updated)
    },
    [template],
  )

  // Update the template, this is where the type-safety checks happen, so this
  // should be the only exposed method to other parts of the app.
  const update: TemplateUpdateType<typeof template> = useCallback(
    (updates) => {
      const keyPaths = flatten(updates)
      set(keyPaths)
      save(keyPaths)
        .then(({updated_at}) => recordUpdates(updated_at, keyPaths))
        .catch(() => {
          // Save failed for some reason, let's force a user refresh
          dispatch(setIsConnected(false))
        })
    },
    [dispatch, recordUpdates, set, save],
  )

  // Handle live updates from server
  useEffect(() => {
    channel.listen(UPDATED_TEMPLATE, (data: TemplateUpdate) => {
      const newUpdates = onlyNewUpdates(data)
      recordUpdates(data.updated_at, newUpdates)
      set(newUpdates)
    })

    return () => {
      channel.stopListening(UPDATED_TEMPLATE)
    }
  }, [channel, onlyNewUpdates, recordUpdates, set])

  return (
    <TemplateUpdateContext.Provider value={update}>
      {props.children(template)}
    </TemplateUpdateContext.Provider>
  )
}

function useSave() {
  const {client} = useOrganization()
  const {event} = useEvent()

  const url = api(`/events/${event.slug}/template`)

  return useCallback(
    (keyPaths: Record<string, any>) =>
      client.put<ObvioEvent>(url, {template: keyPaths}),
    [client, url],
  )
}

export function useTemplateUpdate<T extends Template>() {
  const context = React.useContext(TemplateUpdateContext)
  if (context === undefined) {
    throw new Error(
      'useTemplateUpdate must be used within a TemplateUpdateProvider',
    )
  }

  return context as TemplateUpdateType<T>
}
