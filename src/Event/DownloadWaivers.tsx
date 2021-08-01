import React from 'react'
import {api} from 'lib/url'
import {useParams} from 'react-router-dom'
import DownloadFile from 'organization/DownloadFile'

export default function DownloadWaivers() {
  const {file} = useParams<{file: string}>()
  const url = api(`/waiver_exports/${file}`)
  return <DownloadFile url={url} />
}
