import {OfflinePageProps} from 'Event/JoinArea/OfflinePage'
import React from 'react'
import Page, {Title} from 'Event/template/SimpleBlog/Login/Page'

export default function OfflinePage(props: OfflinePageProps) {
  const {title, description, isPreview} = props
  return (
    <Page isPreview={isPreview || false}>
      <>
        <Title disableMargin>{title}</Title>
        <div dangerouslySetInnerHTML={{__html: description}} />
      </>
    </Page>
  )
}
