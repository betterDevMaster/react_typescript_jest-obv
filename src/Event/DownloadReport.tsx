import React, {useEffect, useState} from 'react'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {downloadFile, FileLocation} from 'lib/http-client'
import Center from 'lib/ui/layout/Center'
import Typography from '@material-ui/core/Typography'

export default function DownloadReport() {
  const [downloaded, setDownloaded] = useState(false)
  const {event, client} = useEvent()
  const url = api(`/events/${event.slug}/reports/export_first`)

  useEffect(() => {
    if (downloaded) {
      return
    }

    setDownloaded(true)

    client
      .get<FileLocation>(url)
      .then((file) => downloadFile(file.url, file.name))
  }, [downloaded, client, url])

  if (downloaded) {
    return (
      <Center>
        <Typography align="center">
          Download complete, you may close this window.
        </Typography>
      </Center>
    )
  }

  return <FullPageLoader />
}
