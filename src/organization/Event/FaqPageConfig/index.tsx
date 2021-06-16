import React from 'react'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {useTemplate} from 'Event/TemplateProvider'
import SimpleBlogFaqConfig from 'Event/template/SimpleBlog/FaqPage/FaqPageConfig'
import {PANELS} from 'Event/template/Panels'
import PanelsFaqConfig from 'Event/template/Panels/Dashboard/Faqs/FaqPageConfig'

export default function FaqPageConfig() {
  const {name} = useTemplate()
  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogFaqConfig />
    case PANELS:
      return <PanelsFaqConfig />
    default:
      break
  }
  throw new Error(`Faq Page config has not been defined for template: ${name}`)
}
