import React from 'react'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {useTemplate} from 'Event/TemplateProvider'
import SimpleBlogSponsorConfig from 'Event/template/SimpleBlog/SponsorPage/SponsorPageConfig'
import PanelsSponsorConfig from 'Event/template/Panels/Dashboard/Sponsors/SponsorPageConfig'
import CardsSponsorConfig from 'Event/template/Cards/Sponsors/SponsorPageConfig'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'

export default function SponsorPageConfig() {
  const {name} = useTemplate()
  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSponsorConfig />
    case PANELS:
      return <PanelsSponsorConfig />
    case CARDS:
      return <CardsSponsorConfig />
    default:
      break
  }
  throw new Error(
    `Speaker Page config has not been defined for template: ${name}`,
  )
}
