import React from 'react'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {useTemplate} from 'Event/TemplateProvider'
import SimpleBlogSpeakerConfig from 'Event/template/SimpleBlog/SpeakerPage/SpeakerPageConfig'
import PanelsSpeakeronfig from 'Event/template/Panels/Dashboard/Speakers/SpeakerPageConfig'
import CardsSpeakeronfig from 'Event/template/Cards/Speakers/SpeakerPageConfig'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'

export default function SpeakerPageConfig() {
  const {name} = useTemplate()
  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSpeakerConfig />
    case PANELS:
      return <PanelsSpeakeronfig />
    case CARDS:
      return <CardsSpeakeronfig />
    default:
      break
  }
  throw new Error(
    `Speaker Page config has not been defined for template: ${name}`,
  )
}
