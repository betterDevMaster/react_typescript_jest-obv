import React from 'react'
import {useCards} from 'Event/template/Cards'
import OfflinePage from 'Event/template/Cards/OfflinePage'

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const {template} = useCards()
  const {offlinePage: offline} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offline.title}
      description={offline.description}
    />
  )
}
