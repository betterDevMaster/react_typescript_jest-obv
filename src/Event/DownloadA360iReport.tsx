import React, {useEffect, useState} from 'react'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {downloadFile, FileLocation} from 'lib/http-client'
import Center from 'lib/ui/layout/Center'
import Typography from '@material-ui/core/Typography'
import {useParams} from 'react-router-dom'

export default function DownloadA360iReport() {
  const [downloaded, setDownloaded] = useState(false)
  const {client} = useEvent()
  const {index} = useParams<{index: string}>()
  const url = api(`/a360i/reports/${index}`)

  useEffect(() => {
    if (downloaded) {
      return
    }

    setDownloaded(true)

    client
      .get<FileLocation[]>(url)
      .then((files) =>
        files.forEach((file: FileLocation) =>
          downloadFile(file.url, file.name),
        ),
      )
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
