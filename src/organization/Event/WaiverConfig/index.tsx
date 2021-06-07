import React from 'react'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {useTemplate} from 'Event/TemplateProvider'
import SimpleBlogWaiverConfig from 'Event/template/SimpleBlog/Step2/WaiverConfig'
import PanelsWaiverConfig from 'Event/template/Panels/Step2/WaiverConfig'
import {PANELS} from 'Event/template/Panels'

export default function WaiverConfig() {
  const template = useTemplate()
  const templateName = template.name
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogWaiverConfig />
    case PANELS:
      return <PanelsWaiverConfig />
    default:
      break
  }
  throw new Error(
    `Waiver config has not been defined for template: ${templateName}`,
  )
}
