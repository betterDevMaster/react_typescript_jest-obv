import Button from '@material-ui/core/Button'
import React from 'react'
import ExportMenuItem, {
  useExportAttendees,
} from 'organization/Event/AttendeeManagement/AttendeeTools/ExportMenuItem'
import ImportMenuItem, {
  useImportAttendees,
} from 'organization/Event/AttendeeManagement/AttendeeTools/ImportMenuItem'
import DownloadWaiversMenuItem, {
  useDownloadWaivers,
} from 'organization/Event/AttendeeManagement/AttendeeTools/DownloadWaiversMenuItem'
import SyncMailchimpTagsItem, {
  useSyncMailchimpTags,
} from 'organization/Event/AttendeeManagement/AttendeeTools/SyncMailchimpTagsItem'
import Menu from 'lib/Menu'
import ImportMailchimpAudienceMenuItem from 'organization/Event/AttendeeManagement/AttendeeTools/ImportMailchimpAudienceMenuItem'
import {useImportAudience} from 'organization/Event/Services/Apps/Mailchimp/Config/ImportAudienceButton'

export type MenuItemActionProps = {
  disabled?: boolean
  onClick: () => void
}

export default function AttendeeTools(props: {
  onSuccess: (message: string | null) => void
  onError: (message: string | null) => void
}) {
  const {onSuccess, onError} = props

  const {exportAttendees} = useExportAttendees(onSuccess)

  const {file, setFile, processing: processingImport} = useImportAttendees(
    onSuccess,
  )

  const {processing: processingWaivers, downloadWaivers} = useDownloadWaivers(
    onSuccess,
    onError,
  )

  const {
    processing: processingAudienceImport,
    importAudience: startImport,
  } = useImportAudience(onSuccess)

  const {
    processing: processingMailchimpSync,
    sync: syncMailchimpTags,
  } = useSyncMailchimpTags(onSuccess)

  const handle = (action: () => void) => () => {
    action()
  }

  const handleFileSelect = (file: File | null) => {
    setFile(file)
  }

  return (
    <>
      <Menu
        button={({open}) => (
          <Button
            color="primary"
            variant="outlined"
            aria-label="select other action"
            onClick={open}
          >
            Attendee Tools
          </Button>
        )}
      >
        <ImportMenuItem
          file={file}
          onSelectFile={handleFileSelect}
          disabled={processingImport}
        />
        <ExportMenuItem onClick={handle(exportAttendees)} />
        <DownloadWaiversMenuItem
          disabled={processingWaivers}
          onClick={handle(downloadWaivers)}
        />
        <SyncMailchimpTagsItem
          disabled={processingMailchimpSync}
          onClick={handle(syncMailchimpTags)}
        />
        <ImportMailchimpAudienceMenuItem
          disabled={processingAudienceImport}
          onClick={startImport}
        />
      </Menu>
    </>
  )
}
