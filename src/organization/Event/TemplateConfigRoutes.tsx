import {CARDS} from 'Event/template/Cards'
import {PANELS} from 'Event/template/Panels'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {useTemplate} from 'Event/TemplateProvider'
import React from 'react'
import SimpleBlogRoutes from 'Event/template/SimpleBlog/ConfigRoutes'
import PanelsRoutes from 'Event/template/Panels/ConfigRoutes'
import CardsRoutes from 'Event/template/Cards/ConfigRoutes'

export default function TemplateConfigRoutes() {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogRoutes />
    case PANELS:
      return <PanelsRoutes />
    case CARDS:
      return <CardsRoutes />
  }
}
