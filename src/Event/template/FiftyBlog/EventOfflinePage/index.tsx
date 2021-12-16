import React from 'react'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import OfflinePage from 'Event/template/FiftyBlog/OfflinePage'

export default function EventOfflinePage(props: {isPreview?: boolean}) {
  const template = useFiftyBlogTemplate()
  const {offlinePage} = template

  return (
    <OfflinePage
      isPreview={props.isPreview}
      title={offlinePage.title}
      description={offlinePage.description}
    />
  )
}
