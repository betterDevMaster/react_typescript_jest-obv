import React from 'react'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from 'Event/template/SimpleBlog/EventOfflinePage/OfflineConfig'
import OfflinePage from 'Event/template/SimpleBlog/OfflinePage'

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const {template} = useSimpleBlog()
  const {offlinePage: offline} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offline?.title || DEFAULT_TITLE}
      description={offline?.description || DEFAULT_DESCRIPTION}
    />
  )
}
