import React from 'react'
import {User} from 'auth/user'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {Speaker} from 'Event/SpeakerPage'
import SpeakerList from 'Event/template/SimpleBlog/SpeakerPage/SpeakerList'
import SpeakerEditDialog from 'Event/template/SimpleBlog/SpeakerPage/SpeakerEditDialog'
import {PageTitle, PageDescription} from 'Event/template/SimpleBlog/Page'
import {useAttendeeVariables} from 'Event'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import Content from 'lib/ui/form/TextEditor/Content'

export default function SimpleBlogSpeakerPage(props: {
  user: User
  isEditMode?: boolean
  speakers: Speaker[]
}) {
  const {speakers: speakerPageSettings} = useSimpleBlogTemplate()
  const v = useAttendeeVariables()

  const content = (
    <>
      <PageTitle aria-label="speakers title">
        {v(speakerPageSettings.title)}
      </PageTitle>
      <PageDescription>
        <Content aria-label="speakers description">
          {v(speakerPageSettings?.description)}
        </Content>
      </PageDescription>
      <BackToDashboard color={speakerPageSettings.backToDashboardTextColor}>
        <Link to="/">{v(speakerPageSettings.backToDashboardText)}</Link>
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

const BackToDashboard = styled.div`
  text-align: center;
  margin-bottom: 20px;
  a {
    line-height: 1.5;
    color: ${(props) => props.color};
  }
`
