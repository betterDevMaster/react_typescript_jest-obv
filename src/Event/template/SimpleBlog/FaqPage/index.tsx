import React from 'react'
import {Link} from 'react-router-dom'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {FAQ} from 'Event/FaqPage'
import FaqList from 'Event/template/SimpleBlog/FaqPage/FaqList'
import {User} from 'auth/user'
import FaqEditDialog from 'Event/template/SimpleBlog/FaqPage/FaqEditDialog'
import {useTemplate} from 'Event/TemplateProvider'
import {
  DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
  DEFAULT_DESCRIPTION,
  DEFAULT_BACK_TO_DASHBOARD_TEXT,
  DEFAULT_TITLE,
} from 'Event/template/SimpleBlog/FaqPage/FaqList/Card'

import {PageTitle} from 'Event/template/SimpleBlog/Page'
import {useVariables} from 'Event'

export default function SimpleBlogFaqPage(props: {
  user: User
  isEditMode?: boolean
  faqs: FAQ[]
}) {
  const {faqs} = props
  const template = useTemplate()
  const {faq: pageSettings} = template
  const v = useVariables()

  const content = (
    <>
      <PageTitle aria-label="faqs title">
        {v(pageSettings?.title || DEFAULT_TITLE)}
      </PageTitle>
      <SubTitle>
        <div
          aria-label="description"
          dangerouslySetInnerHTML={{
            __html: v(pageSettings?.description || DEFAULT_DESCRIPTION),
          }}
        />
      </SubTitle>
      <BackToDashboard
        color={
          pageSettings?.backToDashboardTextColor ||
          DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR
        }
      >
        <Link to="/">
          {v(
            pageSettings?.backToDashboardText || DEFAULT_BACK_TO_DASHBOARD_TEXT,
          )}
        </Link>
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
