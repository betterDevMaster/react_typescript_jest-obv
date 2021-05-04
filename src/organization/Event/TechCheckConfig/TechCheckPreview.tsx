import React from 'react'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import ProgressBar from 'lib/ui/ProgressBar'
import {useTemplate} from 'Event/TemplateProvider'
import {useWithVariables} from 'Event'

import { useEvent } from 'Event/EventProvider'
import { TechCheckTemplateProps } from 'organization/Event/TechCheckConfig/Form'
import {Buttons, Body} from 'Event/template/SimpleBlog/TechCheck'

export function TechCheckPreview(props:{ user: User, techCheckTemplate:  TechCheckTemplateProps, body: string}) {
  const template = useTemplate()
  const {event} = useEvent();
  const {tech_check: techCheck} = event
  const v = useWithVariables()

  if( techCheck === null ){
    return (
      <div>
        No config
      </div>
    )
  }
  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="md">
        <ProgressBar
          value={75}
          barColor={template.progressBar.barColor}
          textColor={template.progressBar.textColor}
          borderRadius={template.progressBar.borderRadius}
          thickness={template.progressBar.thickness}
        />
        <Body
          dangerouslySetInnerHTML={{
            __html: v(props.body),
          }}
        />
        <Buttons techCheck={techCheck} settings={props.techCheckTemplate} />
      </Container>
    </SimpleBlogPage>
  )
}
