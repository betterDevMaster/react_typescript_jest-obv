import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogImageWaterfallConfig from 'Event/template/SimpleBlog/ImageWaterfall/ImageWaterfallConfig'
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
    default:
      throw new Error(
        `ImageWaterfallConfig not implemented for template ${name}.`,
      )
  }
}
