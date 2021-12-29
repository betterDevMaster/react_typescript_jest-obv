import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'

import SimpleBlogSponsorConfig from 'Event/template/SimpleBlog/SponsorPage/SponsorPageConfig'
import PanelsSponsorConfig from 'Event/template/Panels/Dashboard/Sponsors/SponsorPageConfig'
import CardsSponsorConfig from 'Event/template/Cards/Sponsors/SponsorPageConfig'
import NiftyFiftySponsorConfig from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorPageConfig'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'

export default function SponsorPageConfig() {
  const {name} = useTemplate()
  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSponsorConfig />
    case PANELS:
      return <PanelsSponsorConfig />
    case CARDS:
      return <CardsSponsorConfig />
    case NIFTY_FIFTY:
      return <NiftyFiftySponsorConfig />
    default:
      break
  }
  throw new Error(
    `Speaker Page config has not been defined for template: ${name}`,
  )
}
