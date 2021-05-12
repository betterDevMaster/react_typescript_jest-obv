import {CustomTicketRibbon} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import React, {useCallback, useEffect} from 'react'
import ImageUpload from 'lib/ui/form/ImageUpload'
import {useFileSelect} from 'lib/ui/form/file'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Box from '@material-ui/core/Box'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import {TicketRibbonConfigProps} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbonConfig'

export default function CustomRibbonUpload(props: TicketRibbonConfigProps) {
  const {processing, setProcessing, update, ticketRibbon} = props
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
      .then((customRibbon) => {
        update('customRibbon')(customRibbon)
      })
      .finally(() => {
        removeSelectedUpload() // Required to prevent upload loop
        setProcessing(false)
      })
  }, [
    selectedUpload,
    update,
    uploadCustomRibbon,
    processing,
    removeSelectedUpload,
    setProcessing,
  ])

  /**
   * Already uploaded a custom image, so we won't show
   * the upload button again.
   */
  if (Boolean(ticketRibbon.customRibbon)) {
    return null
  }

  return (
    <Box mb={2}>
      <ImageUpload file={customImage}>
        {/* Same dimensions as default ribbons */}
        <Cropper width={1405} height={263} />
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

function useUploadCustomRibbon() {
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
