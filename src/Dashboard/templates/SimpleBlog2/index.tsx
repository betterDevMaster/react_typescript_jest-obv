import React from 'react'

export const SIMPLE_BLOG_2 = 'SIMPLE_BLOG_2'
export type SimpleBlog2Dashboard = {
  template: typeof SIMPLE_BLOG_2
  welcomeText: string
  blog2Attr: number
}

export const SimpleBlog2 = (props: {dashboard: SimpleBlog2Dashboard}) => {
  return <div>{props.dashboard.template}</div>
}
