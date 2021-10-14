import {useEvent} from 'Event/EventProvider'
import {FileLocation} from 'lib/http-client'
import {useToggle} from 'lib/toggle'
import {FileSelect} from 'lib/ui/form/file'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useCallback, useEffect, useMemo, useState} from 'react'

export interface Asset {
  id: number
  file: FileLocation
}

/**
 * Auto-upload whenever a file select changes.
 *
 * @param upload
 * @param file
 * @returns
 */
export function useUploadAsset<T>(
  onUpload: (asset: Asset) => void,
  onRemove: () => void,
  file: FileSelect,
) {
  const {selected, wasRemoved} = file
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const [error, setError] = useState<string | null>(null)
  const upload = useUpload()
  const remove = useRemove()

  const data = useMemo(() => {
    if (!selected) {
      return null
    }
    const formData = new FormData()
    formData.set('file', selected)
    return formData
  }, [selected])

  useEffect(() => {
    if (processing) {
      return
    }

    if (data) {
      toggleProcessing()
      upload(data)
        .then(onUpload)
        .catch((e) => {
          setError(e.message)
        })
        .finally(toggleProcessing)
      return
    }

    if (wasRemoved && file.current) {
      toggleProcessing()
      remove(file.current)
        .then(onRemove)
        .catch((e) => setError(e.message))
        .finally(toggleProcessing)
    }
  }, [
    selected,
    wasRemoved,
    upload,
    data,
    processing,
    onUpload,
    remove,
    toggleProcessing,
    file,
    onRemove,
  ])

  return {processing, error}
}

function useUpload() {
  const {event} = useEvent()
  const {client} = useOrganization()

  const url = api(`/events/${event.slug}/assets`)

  return useCallback((data: FormData) => client.post<Asset>(url, data), [
    client,
    url,
  ])
}

function useRemove() {
  const {client} = useOrganization()

  return useCallback(
    (file: FileLocation) => {
      const url = api(`/assets/${file.name}`)
      return client.delete<void>(url)
    },
    [client],
  )
}
