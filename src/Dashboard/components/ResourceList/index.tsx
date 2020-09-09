import React from 'react'
import Heading from 'Dashboard/templates/SimpleBlog/Sidebar/Heading'

export interface Resource {
  name: string
  filePath: string
  icon: string
}

/**
 * Material UI Icon component names
 * https://material-ui.com/components/material-icons/
 */
export const RESOURCE_ICON = {
  pdf: 'PictureAsPdf',
  attachment: 'Attachment',
}

export function ResourceList(props: {resources: Resource[]}) {
  const hasResources = props.resources.length > 0
  if (!hasResources) {
    return null
  }

  return (
    <div>
      <Heading>RESOURCES:</Heading>
      {props.resources.map((resource, index) => (
        <div key={index} aria-label="event resource">
          {resource.name}
        </div>
      ))}
    </div>
  )
}
