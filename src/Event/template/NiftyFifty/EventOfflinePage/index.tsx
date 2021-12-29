import React from 'react'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import OfflinePage from 'Event/template/NiftyFifty/OfflinePage'

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const template = useNiftyFiftyTemplate()
  const {offlinePage} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offlinePage.title}
      description={offlinePage.description}
    />
  )
}
