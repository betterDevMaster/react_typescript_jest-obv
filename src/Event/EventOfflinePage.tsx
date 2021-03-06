import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogEventOffline from 'Event/template/SimpleBlog/EventOfflinePage'
import {PANELS} from 'Event/template/Panels'
import PanelsEventOffline from 'Event/template/Panels/EventOfflinePage'
import {CARDS} from 'Event/template/Cards'
import CardsEventOffline from 'Event/template/Cards/EventOfflinePage'
import {NIFTY_FIFTY} from './template/NiftyFifty'
import NiftyFiftyEventOffline from 'Event/template/NiftyFifty/EventOfflinePage'

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const template = useTemplate()
  const {isPreview} = props
  const {name, offlinePage: settings} = template

  if (settings?.shouldRedirect && settings?.redirectUrl && !isPreview) {
    window.location.href = settings.redirectUrl
    return null
  }

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogEventOffline isPreview={isPreview} />
    case PANELS:
      return <PanelsEventOffline isPreview={isPreview} />
    case CARDS:
      return <CardsEventOffline isPreview={isPreview} />
    case NIFTY_FIFTY:
      return <NiftyFiftyEventOffline isPreview={isPreview} />
    default:
      throw new Error(`Missing offline page for template: ${name}`)
  }
}
