import React from 'react'
import styled from 'styled-components'
import {FAQ} from 'Event/FaqPage'
import FaqList from 'Event/template/FiftyBlog/Dashboard/Faqs/FaqList'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import FaqEditDialog from 'Event/template/FiftyBlog/Dashboard/Faqs/FaqEditDialog'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from 'Event/template/FiftyBlog/Dashboard/Faqs/FaqList/Card'
import {PageTitle} from 'Event/template/FiftyBlog/Page'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useToggle} from 'lib/toggle'
import {useAttendeeVariables} from 'Event'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import PageSettingsDialog from 'Event/template/FiftyBlog/Dashboard/Faqs/FaqPageConfig/PageSettingsDialog'
import Content from 'lib/ui/form/TextEditor/Content'

export default function FiftyBlogFaqPage(props: {
  isEditMode?: boolean
  faqs: FAQ[]
}) {
  const {faqs} = props
  const template = useFiftyBlogTemplate()
  const {faq: pageSettings} = template
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <>
      <EditModeOnly>
        <PageSettingsDialog visible={configVisible} onClose={toggleConfig} />
      </EditModeOnly>
      <Editable onEdit={toggleConfig}>
        <PageTitle aria-label="faqs title">
          {v(pageSettings?.title || DEFAULT_TITLE)}
        </PageTitle>
      </Editable>
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
  text-align: left;
  margin: 20px 20px;
`
