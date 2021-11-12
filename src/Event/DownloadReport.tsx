import React, {useEffect, useState, useCallback} from 'react'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {downloadFile, FileLocation} from 'lib/http-client'
import Center from 'lib/ui/layout/Center'
import Typography from '@material-ui/core/Typography'
import {useAsync} from 'lib/async'
import {Report} from 'organization/Event/ReportsProvider'
import {useAttendeeVariables} from 'Event'

export default function DownloadReport() {
  const [downloaded, setDownloaded] = useState(false)
  const {event, client} = useEvent()

  const v = useAttendeeVariables()
  const {data: reports} = useFetchReports()

  const url = api(`/events/${event.slug}/reports/export_first`)

  useEffect(() => {
    if (downloaded && !reports) {
      return
    }

    if (reports?.length) {
      const report = reports[0]
      const {settings} = report
      const header = settings?.header
      const footer = settings?.footer

      const headerText = v(header?.title)
      const footerText = v(footer?.text)

      client
        .post<FileLocation[]>(url, {
          header: headerText,
          footer: footerText,
        })
        .then((files) => {
          files.forEach((file: FileLocation) =>
            downloadFile(file.url, file.name),
          )
          setDownloaded(true)
        })
    }
  }, [downloaded, client, url, reports, v])

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

function useFetchReports() {
  const {event, client} = useEvent()
  const url = api(`/events/${event.slug}/reports`)
  const request = useCallback(() => client.get<Report[]>(url), [url, client])

  return useAsync(request)
}
