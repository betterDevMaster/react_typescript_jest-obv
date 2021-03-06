import React from 'react'

import {RequestJoinUrlError} from 'Event/EventProvider'
import {useTemplate} from 'Event/TemplateProvider'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'
import SimpleBlogOfflinePage from 'Event/template/SimpleBlog/OfflinePage'
import PanelsOfflinePage from 'Event/template/Panels/OfflinePage'
import CardsOfflinePage from 'Event/template/Cards/OfflinePage'
import NiftyFiftyOfflinePage from 'Event/template/NiftyFifty/OfflinePage'

const FALLBACK_OFFLINE_TITLE = 'Area is currently offline'

export type OfflinePageProps = {
  title: string
  description: string
  isPreview?: boolean
}

export default function OfflinePage(props: {error: RequestJoinUrlError}) {
  const {error} = props

  const title = error.offline_title || FALLBACK_OFFLINE_TITLE
  const description = error.offline_description || ''

  return <TemplateOfflinePage title={title} description={description} />
}

function TemplateOfflinePage(props: OfflinePageProps) {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogOfflinePage {...props} />
    case PANELS:
      return <PanelsOfflinePage {...props} />
    case CARDS:
      return <CardsOfflinePage {...props} />
    case NIFTY_FIFTY:
      return <NiftyFiftyOfflinePage {...props} />
    default:
      throw new Error(`Missing offline page for template: ${name}`)
  }
}
