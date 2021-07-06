import React from 'react'
import {api} from 'lib/url'
import DownloadFile from 'organization/DownloadFile'
import {useParams} from 'react-router-dom'

export default function DownloadFormSubmissions() {
  const {file} = useParams<{file: string}>()
  const url = api(`/form_submissions/${file}`)
  return <DownloadFile url={url} />
}
