import React from 'react'
import {useCardsTemplate} from 'Event/template/Cards'
import OfflinePage from 'Event/template/Cards/OfflinePage'

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const template = useCardsTemplate()
  const {offlinePage: offline} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offline.title}
      description={offline.description}
    />
  )
}
