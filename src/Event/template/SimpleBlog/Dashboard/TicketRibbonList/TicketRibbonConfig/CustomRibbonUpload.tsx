import {
  CustomTicketRibbon,
  TicketRibbon,
} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbon'
import React, {useCallback, useEffect} from 'react'
import ImageUpload from 'lib/ui/form/ImageUpload'
import {useFileSelect} from 'lib/ui/form/file'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Box from '@material-ui/core/Box'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import {TicketRibbonConfigProps} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig'

export default function CustomRibbonUpload(
  props: TicketRibbonConfigProps & {
    setCustomRibbon: (customRibbon: TicketRibbon['customRibbon']) => void
  },
) {
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
   * Already uploaded a custom image, so we won't show
   * the upload button again.
   */
  if (Boolean(customRibbon)) {
    return null
  }

  return (
    <Box mb={2}>
      <ImageUpload file={customImage}>
        {/* Same dimensions as default ribbons */}
        <Cropper width={800} height={150} />
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
