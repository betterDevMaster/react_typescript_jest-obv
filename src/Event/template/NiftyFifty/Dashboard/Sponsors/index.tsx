import React from 'react'
import styled from 'styled-components'

import {useTheme, useMediaQuery} from '@material-ui/core'

import {useAttendeeVariables} from 'Event'
import {Sponsor} from 'Event/SponsorPage'
import SponsorList from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorList'
import SponsorEditDialog from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorEditDialog'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {PageTitle, PageDescription} from 'Event/template/NiftyFifty/Page'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import PageSettingsDialog from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorPageConfig/PageSettingsDialog'

import {useToggle} from 'lib/toggle'
import Content from 'lib/ui/form/TextEditor/Content'

export default function SponsorPage(props: {
  isEditMode?: boolean
  sponsors: Sponsor[]
}) {
  const template = useNiftyFiftyTemplate()
  const {sponsors} = props
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
        <PageTitle
          aria-label="sponsors title"
          color={template.pageTitleColor}
          size={template.pageTitleFontSize}
        >
          {v(template.sponsors.title)}
        </PageTitle>
      </Editable>
      <PageDescription
        aria-label="sponsors description"
        color={template.textColor}
      >
        <Content>{v(template.sponsors.description)}</Content>
      </PageDescription>
      <SponsorEditDialog isEditMode={props.isEditMode} />
      <SponsorList sponsors={sponsors} isEditMode={props.isEditMode} />
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
