import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'

import {CARDS} from 'Event/template/Cards'
import {PANELS} from 'Event/template/Panels'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'

import SimpleBlogRoutes from 'Event/template/SimpleBlog/ConfigRoutes'
import PanelsRoutes from 'Event/template/Panels/ConfigRoutes'
import CardsRoutes from 'Event/template/Cards/ConfigRoutes'
import FiftyBlogRoutes from 'Event/template/FiftyBlog/ConfigRoutes'

export default function TemplateConfigRoutes() {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogRoutes />
    case PANELS:
      return <PanelsRoutes />
    case CARDS:
      return <CardsRoutes />
    case FIFTY_BLOG:
      return <FiftyBlogRoutes />
    default:
      throw new Error(`Missing Template Config Routes for template: ${name}`)
  }
}
