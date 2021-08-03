import React from 'react'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import OfflinePage from 'Event/template/SimpleBlog/OfflinePage'

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const {template} = useSimpleBlog()
  const {offlinePage: offline} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offline.title}
      description={offline.description}
    />
  )
}
