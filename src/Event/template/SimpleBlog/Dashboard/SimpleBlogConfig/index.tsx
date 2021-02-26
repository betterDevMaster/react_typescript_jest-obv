import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {SimpleBlog, SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'

export type SimpleBlogConfig = {
  type: typeof SIMPLE_BLOG
}

export function SimpleBlogConfig() {
  const template = useTemplate()
  const updateTemplate = useUpdateTemplate()
  const {event} = useEvent()

  const update = <T extends keyof SimpleBlog>(key: T) => (
    value: SimpleBlog[T],
  ) => {
    updateTemplate({
      [key]: value,
    })
  }

  return (
    <>
      <EventImageUpload
        label="Header Background"
        property="header_background"
        current={event.header_background?.url}
      />
      <EventImageUpload
        label="Logo"
        property="logo"
        current={event.logo?.url}
      />
      <ColorPicker
        label="Primary Color"
        color={template.primaryColor}
        onPick={update('primaryColor')}
      />
    </>
  )
}
