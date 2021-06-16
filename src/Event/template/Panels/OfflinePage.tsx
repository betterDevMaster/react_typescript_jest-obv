import {OfflinePageProps} from 'Event/JoinArea/OfflinePage'
import React from 'react'
import Page, {Description, Title} from 'Event/template/Panels/Login/Page'

export default function OfflinePage(props: OfflinePageProps) {
  const {title, description} = props
  return (
    <Page isPreview={false}>
      <>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </>
    </Page>
  )
}
