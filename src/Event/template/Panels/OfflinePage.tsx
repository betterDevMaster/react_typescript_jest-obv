import {OfflinePageProps} from 'Event/JoinArea/OfflinePage'
import React from 'react'
import Page, {Title} from 'Event/template/Panels/Login/Page'

export default function OfflinePage(props: OfflinePageProps) {
  const {title, description, isPreview} = props
  return (
    <Page isPreview={isPreview || false}>
      <>
        <Title>{title}</Title>
        <div dangerouslySetInnerHTML={{__html: description}} />
      </>
    </Page>
  )
}
