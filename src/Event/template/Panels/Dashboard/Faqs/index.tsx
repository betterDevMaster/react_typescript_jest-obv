import React from 'react'
import styled from 'styled-components'
import {FAQ} from 'Event/FaqPage'
import FaqList from 'Event/template/Panels/Dashboard/Faqs/FaqList'
import {User} from 'auth/user'
import FaqEditDialog from 'Event/template/Panels/Dashboard/Faqs/FaqEditDialog'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from 'Event/template/Panels/Dashboard/Faqs/FaqList/Card'
import {PageTitle} from 'Event/template/Panels/Page'
import {useAttendeeVariables} from 'Event'
import {usePanels} from 'Event/template/Panels'
import Content from 'lib/ui/form/TextEditor/Content'

export default function PanelsFaqPage(props: {
  user: User
  isEditMode?: boolean
  faqs: FAQ[]
}) {
  const {faqs} = props
  const {template} = usePanels()
  const {faq: pageSettings} = template
  const v = useAttendeeVariables()

  return (
    <>
      <PageTitle aria-label="faqs title">
        {v(pageSettings?.title || DEFAULT_TITLE)}
      </PageTitle>
      <SubTitle>
        <Content aria-label="description">
          {v(pageSettings?.description || DEFAULT_DESCRIPTION)}
        </Content>
      </SubTitle>
      <FaqEditDialog isEditMode={props.isEditMode} />
      <FaqList faqs={faqs} isEditMode={props.isEditMode} />
    </>
  )
}

const SubTitle = styled.div`
  text-align: center;
  margin: 20px 20px;
`
