import React from 'react'
import {api} from 'lib/url'
import {useParams} from 'react-router-dom'
import DownloadFile from 'organization/DownloadFile'

export default function DownloadQuestionSubmissions() {
  const {file} = useParams<{file: string}>()
  const url = api(`/question_submissions/${file}`)

  return <DownloadFile url={url} />
}
