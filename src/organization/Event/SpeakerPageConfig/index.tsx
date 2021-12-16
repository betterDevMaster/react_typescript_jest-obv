import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'

import SimpleBlogSpeakerConfig from 'Event/template/SimpleBlog/SpeakerPage/SpeakerPageConfig'
import PanelsSpeakeronfig from 'Event/template/Panels/Dashboard/Speakers/SpeakerPageConfig'
import CardsSpeakeronfig from 'Event/template/Cards/Speakers/SpeakerPageConfig'
import FiftyBlogSpeakeronfig from 'Event/template/FiftyBlog/Dashboard/Speakers/SpeakerPageConfig'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'

export default function SpeakerPageConfig() {
  const {name} = useTemplate()
  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSpeakerConfig />
    case PANELS:
      return <PanelsSpeakeronfig />
    case CARDS:
      return <CardsSpeakeronfig />
    case FIFTY_BLOG:
      return <FiftyBlogSpeakeronfig />
    default:
      break
  }
  throw new Error(
    `Speaker Page config has not been defined for template: ${name}`,
  )
}
