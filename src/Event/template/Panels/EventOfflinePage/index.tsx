import React from 'react'
import {usePanels} from 'Event/template/Panels'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from 'Event/template/Panels/EventOfflinePage/OfflineConfig'
import OfflinePage from 'Event/template/Panels/OfflinePage'

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const {template} = usePanels()
  const {offlinePage: offline} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offline?.title || DEFAULT_TITLE}
      description={offline?.description || DEFAULT_DESCRIPTION}
    />
  )
}
