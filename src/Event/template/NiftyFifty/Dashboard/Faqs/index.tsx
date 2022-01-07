import React from 'react'
import styled from 'styled-components'

import {useTheme, useMediaQuery} from '@material-ui/core'

import {useAttendeeVariables} from 'Event'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {FAQ} from 'Event/FaqPage'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import FaqList from 'Event/template/NiftyFifty/Dashboard/Faqs/FaqList'
import FaqEditDialog from 'Event/template/NiftyFifty/Dashboard/Faqs/FaqEditDialog'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from 'Event/template/NiftyFifty/Dashboard/Faqs/FaqList/Card'
import {PageTitle} from 'Event/template/NiftyFifty/Page'
import PageSettingsDialog from 'Event/template/NiftyFifty/Dashboard/Faqs/FaqPageConfig/PageSettingsDialog'

import {useToggle} from 'lib/toggle'
import Content from 'lib/ui/form/TextEditor/Content'

export default function NiftyFiftyFaqPage(props: {
  isEditMode?: boolean
  faqs: FAQ[]
}) {
  const {faqs} = props
  const template = useNiftyFiftyTemplate()
  const {faq: pageSettings} = template
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Paper isXSMobile={isXSMobile}>
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
    </Paper>
  )
}

const Paper = styled.div<{
  isXSMobile: boolean
}>`
  padding: 0
    ${(props) =>
      props.isXSMobile ? props.theme.spacing[8] : props.theme.spacing[12]};
`

const SubTitle = styled.div`
  text-align: left;
  margin: 20px 20px;
`
