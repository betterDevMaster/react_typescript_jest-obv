import React from 'react'
import {Link} from 'react-router-dom'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import SponsorList from 'Event/template/SimpleBlog/SponsorPage/SponsorList'
import {User} from 'auth/user'
import {useEvent} from 'Event/EventProvider'
import SponsorEditDialog from 'Event/template/SimpleBlog/SponsorPage/SponsorEditDialog'
import {PageTitle, PageDescription} from 'Event/template/SimpleBlog/Page'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import {useAttendeeVariables} from 'Event'
import Content from 'lib/ui/form/TextEditor/Content'

export default function SimpleBlogSponsorPage(props: {
  user: User
  isEditMode?: boolean
  sponsors: Sponsor[]
}) {
  const {sponsors} = props
  const {event} = useEvent()
  const template = useSimpleBlogTemplate()
  const {sponsors: sponsorsPageSettings} = template
  const v = useAttendeeVariables()

  const content = (
    <>
      <PageTitle aria-label="sponsors title">
        {event.sponsor_page_title}
      </PageTitle>
      <PageDescription>
        <Content aria-label="speakers description">
          {v(sponsorsPageSettings.description)}
        </Content>
      </PageDescription>
      <BackToDashboard color={sponsorsPageSettings.backToDashboardTextColor}>
        <Link to="/">{sponsorsPageSettings.backToDashboardText}</Link>
      </BackToDashboard>
      <SponsorEditDialog isEditMode={props.isEditMode} />
      <SponsorList sponsors={sponsors} isEditMode={props.isEditMode} />
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
