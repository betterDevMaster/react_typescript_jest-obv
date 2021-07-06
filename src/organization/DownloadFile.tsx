import React, {useEffect, useState} from 'react'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {downloadFile, FileLocation} from 'lib/http-client'
import Center from 'lib/ui/layout/Center'
import Typography from '@material-ui/core/Typography'
import {useOrganization} from 'organization/OrganizationProvider'
import {useToggle} from 'lib/toggle'

export default function DownloadFile(props: {url: string}) {
  const {url} = props
  const [done, setDone] = useState(false)
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const {client} = useOrganization()

  useEffect(() => {
    if (done || processing) {
      return
    }

    toggleProcessing()

    client.get<FileLocation>(url).then((file: FileLocation) => {
      downloadFile(file.url, file.name).then(() => {
        setDone(true)
      })
    })
  }, [done, client, url, processing, toggleProcessing])

  if (done) {
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
