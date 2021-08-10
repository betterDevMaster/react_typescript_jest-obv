import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {useCallback} from 'react'
import {FileLocation} from 'lib/http-client'
import React, {useEffect} from 'react'
import ImageUpload from 'lib/ui/form/ImageUpload'
import {useFileSelect} from 'lib/ui/form/file'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Box from '@material-ui/core/Box'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import UploadedTicketRibbon from 'organization/Event/DashboardConfig/TicketRibbonUpload/UploadedTicketRibbon'

export type CustomTicketRibbon = {
  id: number
  image: FileLocation
}

export type TicketRibbonUploadProps = {
  processing: boolean
  setProcessing: (processing: boolean) => void
  customRibbon?: CustomTicketRibbon | null
  setCustomRibbon: (customRibbon: CustomTicketRibbon | null) => void
  width: number
  height: number
}

export default function TicketRibbonUpload(props: TicketRibbonUploadProps) {
  const {processing, setProcessing, setCustomRibbon, customRibbon} = props
  const customImage = useFileSelect()
  const {selected: selectedUpload, remove: removeSelectedUpload} = customImage
  const uploadCustomRibbon = useUploadCustomRibbon()

  /**
   * Handle selecting, and uploading a custom ribbon. Set to auto-upload
   * as soon as a file is selected.
   */
  useEffect(() => {
    if (!selectedUpload || processing) {
      return
    }

    setProcessing(true)

    uploadCustomRibbon(selectedUpload)
      .then(setCustomRibbon)
      .finally(() => {
        removeSelectedUpload() // Required to prevent upload loop
        setProcessing(false)
      })
  }, [
    selectedUpload,
    uploadCustomRibbon,
    processing,
    removeSelectedUpload,
    setProcessing,
    setCustomRibbon,
  ])

  /**
   * If we've uploaded an image, let's show that instead
   * of the uploader.
   */
  if (Boolean(customRibbon)) {
    return <UploadedTicketRibbon {...props} />
  }

  return (
    <Box mb={2}>
      <ImageUpload file={customImage}>
        <Cropper width={props.width} height={props.height} />
        <UploadButton
          inputProps={{
            'aria-label': 'upload custom image',
          }}
        >
          Upload Custom Ribbon
        </UploadButton>
      </ImageUpload>
    </Box>
  )
}

export function useUploadCustomRibbon() {
  const {client} = useOrganization()
  const {event} = useEvent()

  const url = api(`/events/${event.slug}/ticket_ribbons`)

  return useCallback(
    (image: File) => {
      const data = new FormData()
      data.set('image', image)
      return client.post<CustomTicketRibbon>(url, data)
    },
    [url, client],
  )
}
