import React from 'react'
import {usePanelsTemplate} from 'Event/template/Panels'
import OfflinePage from 'Event/template/Panels/OfflinePage'

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const template = usePanelsTemplate()
  const {offlinePage} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offlinePage.title}
      description={offlinePage.description}
    />
  )
}
