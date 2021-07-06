import React from 'react'
import {api} from 'lib/url'
import {useParams} from 'react-router-dom'
import DownloadFile from 'organization/DownloadFile'

export default function DownloadAttendees() {
  const {file} = useParams<{file: string}>()
  const url = api(`/attendee_exports/${file}`)
  return <DownloadFile url={url} />
}
