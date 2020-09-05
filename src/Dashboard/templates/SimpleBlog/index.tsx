import React from 'react'
import Button from 'Dashboard/components/Button'
import {SimpleBlogStyles} from 'Dashboard/templates/SimpleBlog/Styles'

export const SIMPLE_BLOG = 'SIMPLE_BLOG'
export type SimpleBlogDashboard = {
  template: typeof SIMPLE_BLOG
  welcomeText: string
}

export const SimpleBlog = (props: {dashboard: SimpleBlogDashboard}) => {
  return (
    <div>
      <SimpleBlogStyles />
      <h2>{props.dashboard.welcomeText}</h2>
      <Button textTransform="uppercase">foobar</Button>
    </div>
  )
}
