import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'

import {CARDS} from 'Event/template/Cards'
import {PANELS} from 'Event/template/Panels'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'

import SimpleBlogRoutes from 'Event/template/SimpleBlog/ConfigRoutes'
import PanelsRoutes from 'Event/template/Panels/ConfigRoutes'
import CardsRoutes from 'Event/template/Cards/ConfigRoutes'
import NiftyFiftyRoutes from 'Event/template/NiftyFifty/ConfigRoutes'

export default function TemplateConfigRoutes() {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogRoutes />
    case PANELS:
      return <PanelsRoutes />
    case CARDS:
      return <CardsRoutes />
    case NIFTY_FIFTY:
      return <NiftyFiftyRoutes />
    default:
      throw new Error(`Missing Template Config Routes for template: ${name}`)
  }
}
