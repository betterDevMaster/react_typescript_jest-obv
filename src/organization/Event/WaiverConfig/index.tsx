import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'

import SimpleBlogWaiverConfig from 'Event/template/SimpleBlog/Step2/WaiverConfig'
import PanelsWaiverConfig from 'Event/template/Panels/Step2/WaiverConfig'
import CardsWaiverConfig from 'Event/template/Cards/Step2/WaiverConfig'
import NiftyFiftyWaiverConfig from 'Event/template/NiftyFifty/Step2/WaiverConfig'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'

export default function WaiverConfig() {
  const template = useTemplate()
  const templateName = template.name
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogWaiverConfig />
    case PANELS:
      return <PanelsWaiverConfig />
    case CARDS:
      return <CardsWaiverConfig />
    case NIFTY_FIFTY:
      return <NiftyFiftyWaiverConfig />
    default:
      break
  }
  throw new Error(
    `Waiver config has not been defined for template: ${templateName}`,
  )
}
