import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogFaqConfig from 'Event/template/SimpleBlog/FaqPage/FaqPageConfig'
import {PANELS} from 'Event/template/Panels'
import PanelsFaqConfig from 'Event/template/Panels/Dashboard/Faqs/FaqPageConfig'
import {CARDS} from 'Event/template/Cards'
import CardsFaqConfig from 'Event/template/Cards/Faqs/FaqPageConfig'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'
import FiftyFaqConfig from 'Event/template/FiftyBlog/Dashboard/Faqs/FaqPageConfig'

export default function FaqPageConfig() {
  const {name} = useTemplate()
  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogFaqConfig />
    case PANELS:
      return <PanelsFaqConfig />
    case CARDS:
      return <CardsFaqConfig />
    case FIFTY_BLOG:
      return <FiftyFaqConfig />
    default:
      break
  }
  throw new Error(`Faq Page config has not been defined for template: ${name}`)
}
