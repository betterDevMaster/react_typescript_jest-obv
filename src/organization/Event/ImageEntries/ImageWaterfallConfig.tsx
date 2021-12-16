import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogImageWaterfallConfig from 'Event/template/SimpleBlog/ImageWaterfall/ImageWaterfallConfig'
import {CARDS} from 'Event/template/Cards'
import CardsImageWaterfallConfig from 'Event/template/Cards/ImageWaterfall/ImageWaterfallConfig'
import {PANELS} from 'Event/template/Panels'
import PanelsImageWaterfallConfig from 'Event/template/Panels/Dashboard/ImageWaterfall/ImageWaterfallConfig'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'
import FiftyBlogImageWaterfallConfig from 'Event/template/FiftyBlog/Dashboard/ImageWaterfall/ImageWaterfallConfig'

import ComponentConfig from 'organization/Event/DashboardConfig/ComponentConfig'

type ImageWaterfallConfigProps = {
  onClose: () => void
}

export default function ImageWaterfallConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  return (
    <ComponentConfig
      isVisible={props.isVisible}
      onClose={props.onClose}
      title="Image Waterfall"
    >
      <TemplateConfig {...props} />
    </ComponentConfig>
  )
}

function TemplateConfig(props: ImageWaterfallConfigProps) {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogImageWaterfallConfig {...props} />
    case CARDS:
      return <CardsImageWaterfallConfig {...props} />
    case PANELS:
      return <PanelsImageWaterfallConfig {...props} />
    case FIFTY_BLOG:
      return <FiftyBlogImageWaterfallConfig {...props} />
    default:
      throw new Error(
        `ImageWaterfallConfig not implemented for template ${name}.`,
      )
  }
}
