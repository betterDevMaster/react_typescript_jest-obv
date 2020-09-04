import React from 'react'

export const SIMPLE_BLOG = 'SIMPLE_BLOG'
export type SimpleBlogDashboard = {
  template: typeof SIMPLE_BLOG
  welcomeText: string
}

export const SimpleBlog = (props: {dashboard: SimpleBlogDashboard}) => {
  return <div>{props.dashboard.welcomeText}</div>
}
