import React from 'react'
import {api} from 'lib/url'
import DownloadFile from 'organization/DownloadFile'
import {useParams} from 'react-router-dom'

export default function DownloadAreaAttendees() {
  const {file} = useParams<{file: string}>()
  const url = api(`/area_attendees_export/${file}`)
  return <DownloadFile url={url} />
}
