import React from 'react'
import {Link} from 'react-router-dom'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {FAQ} from 'Event/FaqPage'
import FaqList from 'Event/template/SimpleBlog/FaqPage/FaqList'
import {User} from 'auth/user'
import FaqEditDialog from 'Event/template/SimpleBlog/FaqPage/FaqEditDialog'
import {PageTitle} from 'Event/template/SimpleBlog/Page'
import {useAttendeeVariables} from 'Event'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import Content from 'lib/ui/form/TextEditor/Content'

export default function SimpleBlogFaqPage(props: {
  user: User
  isEditMode?: boolean
  faqs: FAQ[]
}) {
  const {faqs} = props
  const {template} = useSimpleBlog()
  const {faq: pageSettings} = template
  const v = useAttendeeVariables()

  const content = (
    <>
      <PageTitle aria-label="faqs title">{v(pageSettings?.title)}</PageTitle>
      <SubTitle>
        <Content aria-label="description">
          {v(pageSettings?.description)}
        </Content>
      </SubTitle>
      <BackToDashboard color={pageSettings?.backToDashboardTextColor}>
        <Link to="/">{v(pageSettings?.backToDashboardText)}</Link>
      </BackToDashboard>
      <FaqEditDialog isEditMode={props.isEditMode} />
      <FaqList faqs={faqs} isEditMode={props.isEditMode} />
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
