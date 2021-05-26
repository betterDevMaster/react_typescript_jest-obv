import React from 'react'
import {User} from 'auth/user'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {Link} from 'react-router-dom'
import {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_BACK_TO_DASHBOARD_TEXT,
  DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
} from 'organization/Event/SpeakerPageConfig/SpeakerPageEditDialog/Form'
import {Speaker} from 'Event/SpeakerPage'
import SpeakerList from 'Event/template/SimpleBlog/SpeakerPage/SpeakerList'
import SpeakerEditDialog from 'Event/template/SimpleBlog/SpeakerPage/SpeakerEditDialog'

import {PageTitle} from 'Event/template/SimpleBlog/Page'
import {useVariables} from 'Event'
import Content from 'lib/ui/form/TextEditor/Content'

export default function SimpleBlogSpeakerPage(props: {
  user: User
  isEditMode?: boolean
  speakers: Speaker[]
}) {
  const {event} = useEvent()
  const speakerPageSettings = event.template?.speakers
  const v = useVariables()

  const content = (
    <>
      <PageTitle aria-label="speakers title">
        {v(speakerPageSettings?.title || DEFAULT_TITLE)}
      </PageTitle>
      <SubTitle>
        <Content aria-label="speakers description">
          {v(speakerPageSettings?.description || DEFAULT_DESCRIPTION)}
        </Content>
      </SubTitle>
      <BackToDashboard
        color={
          speakerPageSettings?.backToDashboardTextColor ||
          DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR
        }
      >
        <Link to="/">
          {v(
            speakerPageSettings?.backToDashboardText ||
              DEFAULT_BACK_TO_DASHBOARD_TEXT,
          )}
        </Link>
      </BackToDashboard>
      <SpeakerEditDialog isEditMode={props.isEditMode} />
      <SpeakerList speakers={props.speakers} isEditMode={props.isEditMode} />
    </>
  )

  if (props.isEditMode) {
    return content
  }

  return <Page user={props.user}>{content}</Page>
}

const SubTitle = styled.div`
  text-align: center;
  margin: 20px 20px;
`

const BackToDashboard = styled.div`
  text-align: center;
  margin-bottom: 20px;
  a {
    line-height: 1.5;
    color: ${(props) => props.color};
  }
`
