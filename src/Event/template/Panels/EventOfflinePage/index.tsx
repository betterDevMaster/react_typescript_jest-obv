import React from 'react'
import {usePanels, DEFAULTS as TEMPLATE_DEFAULTS} from 'Event/template/Panels'
import OfflinePage from 'Event/template/Panels/OfflinePage'

const DEFAULT = TEMPLATE_DEFAULTS.offlinePage

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const {template} = usePanels()
  const {offlinePage: offline} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offline?.title || DEFAULT.title}
      description={offline?.description || DEFAULT.description}
    />
  )
}
