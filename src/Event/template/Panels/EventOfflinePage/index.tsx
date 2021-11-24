import React from 'react'
import {
  DEFAULTS as TEMPLATE_DEFAULTS,
  usePanelsTemplate,
} from 'Event/template/Panels'
import OfflinePage from 'Event/template/Panels/OfflinePage'

const DEFAULT = TEMPLATE_DEFAULTS.offlinePage

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const template = usePanelsTemplate()
  const {offlinePage} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offlinePage?.title || DEFAULT.title}
      description={offlinePage?.description || DEFAULT.description}
    />
  )
}
