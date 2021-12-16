import React from 'react'

import {useEvent} from 'Event/EventProvider'
import TemplateProvider, {useTemplate} from 'Event/TemplateProvider'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'

import SimpleBlogBackgroundsConfig from 'Event/template/SimpleBlog/Backgrounds/BackgroundsConfig'
import PanelsBackgroundsConfig from 'Event/template/Panels/Dashboard/Resources/Backgrounds/BackgroundsConfig'
import CardsBackgroundsConfig from 'Event/template/Cards/Backgrounds/BackgroundsConfig'
import FiftyBlogBackgroundsConfig from 'Event/template/FiftyBlog/Dashboard/Resources/Backgrounds/BackgroundsConfig'

import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import SelectTemplateForm from 'organization/Event/SelectTemplateForm'

export default function Backgrounds() {
  const {event} = useEvent()

  if (!event.template) {
    return <SelectTemplateForm />
  }

  return (
    <Layout>
      <Page>
        <TemplateProvider template={event.template}>
          <TemplateConfig />
        </TemplateProvider>
      </Page>
    </Layout>
  )
}

function TemplateConfig() {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogBackgroundsConfig />
    case PANELS:
      return <PanelsBackgroundsConfig />
    case CARDS:
      return <CardsBackgroundsConfig />
    case FIFTY_BLOG:
      return <FiftyBlogBackgroundsConfig />
    default:
      throw new Error(`Missing backgrounds config for template: ${name}`)
  }
}
