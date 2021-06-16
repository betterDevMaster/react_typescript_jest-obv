import React from 'react'
import {Link} from 'react-router-dom'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import SponsorList from 'Event/template/SimpleBlog/SponsorPage/SponsorList'
import {User} from 'auth/user'
import {useEvent} from 'Event/EventProvider'
import SponsorEditDialog from 'Event/template/SimpleBlog/SponsorPage/SponsorEditDialog'
import {
  DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
  DEFAULT_DESCRIPTION,
  DEFAULT_BACK_TO_DASHBOARD_TEXT,
} from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card'
import {PageTitle} from 'Event/template/SimpleBlog/Page'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useVariables} from 'Event'
import Content from 'lib/ui/form/TextEditor/Content'

export default function SimpleBlogSponsorPage(props: {
  user: User
  isEditMode?: boolean
  sponsors: Sponsor[]
}) {
  const {sponsors} = props
  const {event} = useEvent()
  const {template} = useSimpleBlog()
  const {sponsors: sponsorsPageSettings} = template
  const v = useVariables()

  const content = (
    <>
      <PageTitle aria-label="sponsors title">
        {event.sponsor_page_title}
      </PageTitle>
      <SubTitle>
        <Content aria-label="speakers description">
          {v(sponsorsPageSettings?.description || DEFAULT_DESCRIPTION)}
        </Content>
      </SubTitle>
      <BackToDashboard
        color={
          sponsorsPageSettings?.backToDashboardTextColor ||
          DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR
        }
      >
        <Link to="/">
          {sponsorsPageSettings?.backToDashboardText ||
            DEFAULT_BACK_TO_DASHBOARD_TEXT}
        </Link>
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
