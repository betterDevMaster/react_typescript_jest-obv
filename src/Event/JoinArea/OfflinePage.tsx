import {RequestJoinUrlError} from 'Event/EventProvider'
import React from 'react'
import Page, {Description, Title} from 'Event/template/SimpleBlog/Login/Page'

const FALLBACK_OFFLINE_TITLE = 'Area is currently offline'

export default function OfflinePage(props: {error: RequestJoinUrlError}) {
  const {error} = props

  const title = error.offline_title || FALLBACK_OFFLINE_TITLE
  const description = error.offline_description || ''

  return (
    <Page isPreview={false}>
      <>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </>
    </Page>
  )
}
