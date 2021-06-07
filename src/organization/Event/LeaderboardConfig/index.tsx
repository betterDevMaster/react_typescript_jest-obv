import React from 'react'
import SimpleBlogLeaderboardConfig from 'Event/template/SimpleBlog/Leaderboard/LeaderboardConfig'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {UseFormMethods} from 'react-hook-form'

export interface LeaderboardConfigProps {
  register: UseFormMethods['register']
  control: UseFormMethods['control']
}

export default function LeaderboardConfig() {
  return (
    <Layout>
      <Page>
        <TemplateLeaderboardPageConfig />
      </Page>
    </Layout>
  )
}

function TemplateLeaderboardPageConfig() {
  const template = useTemplate()

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogLeaderboardConfig />
    default:
      throw new Error(
        `Missing leaderboard page config for template: ${template.name}`,
      )
  }
}
