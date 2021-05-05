import React from 'react'
import styled from 'styled-components'

import {useTemplate} from 'Event/TemplateProvider'
import {TechCheckConfig, useWithVariables} from 'Event'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

import {useEvent} from 'Event/EventProvider'
import {TechCheckTemplateProps} from 'organization/Event/TechCheckConfig/Form'
import {useTeamMember} from 'organization/auth'
import SimpleBlogTechCheck from 'Event/template/SimpleBlog/TechCheck'
import {now} from 'lib/date-time'

export function TechCheckPreview(props: {
  techCheckTemplate: TechCheckTemplateProps
  body: string
  content: string
}) {
  const template = useTemplate()
  const {event} = useEvent()
  const v = useWithVariables()
  const user = useTeamMember()

  const techCheck: TechCheckConfig = {
    body: props.body,
    content: props.content,
    is_enabled: false,
    area_key: null,
    start: now(),
  }

  if (techCheck === null) {
    return <div>No config</div>
  }

  switch (template.name) {
    case SIMPLE_BLOG:
      return (
        <PreviewContainer>
          <SimpleBlogTechCheck
            user={user}
            techCheck={techCheck}
            progress={75}
            isPreview={true}
            techCheckTemplate={props.techCheckTemplate}
          />
        </PreviewContainer>
      )
    default:
      throw new Error(`Missing tech check for template: ${template.name}`)
  }
}

const PreviewContainer = styled.div`
  padding: ${(props) => props.theme.spacing[2]};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
`
