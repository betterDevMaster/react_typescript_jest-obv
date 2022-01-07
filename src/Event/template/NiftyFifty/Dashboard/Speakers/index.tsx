import React from 'react'
import styled from 'styled-components'

import {useTheme, useMediaQuery} from '@material-ui/core'

import {useAttendeeVariables} from 'Event'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {Speaker} from 'Event/SpeakerPage'
import SpeakerList from 'Event/template/NiftyFifty/Dashboard/Speakers/SpeakerList'
import SpeakerEditDialog from 'Event/template/NiftyFifty/Dashboard/Speakers/SpeakerEditDialog'
import {PageDescription, PageTitle} from 'Event/template/NiftyFifty/Page'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import SpeakerPageEditDialog from 'Event/template/NiftyFifty/Dashboard/Speakers/SpeakerPageConfig/SpeakerPageEditDialog'

import {useToggle} from 'lib/toggle'
import Content from 'lib/ui/form/TextEditor/Content'

export default function SpeakerPage(props: {
  isEditMode?: boolean
  speakers: Speaker[]
}) {
  const {speakers: speakerPageSettings} = useNiftyFiftyTemplate()
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <>
      <Paper isXSMobile={isXSMobile}>
        <EditModeOnly>
          <SpeakerPageEditDialog
            visible={configVisible}
            onClose={toggleConfig}
          />
        </EditModeOnly>
        <Editable onEdit={toggleConfig}>
          <PageTitle
            color={speakerPageSettings.welcomeTitleColor}
            size={speakerPageSettings.welcomeTitleFontSize}
            aria-label="speakers title"
          >
            {v(speakerPageSettings.title)}
          </PageTitle>
        </Editable>
        <PageDescription
          aria-label="speakers description"
          color={speakerPageSettings.welcomeDescriptionColor}
          size={speakerPageSettings.welcomeDescriptionFontSize}
        >
          <Content>{v(speakerPageSettings.description)}</Content>
        </PageDescription>
        <SpeakerEditDialog isEditMode={props.isEditMode} />
      </Paper>
      <SpeakerList speakers={props.speakers} isEditMode={props.isEditMode} />
    </>
  )
}

const Paper = styled.div<{
  isXSMobile: boolean
}>`
  padding: 0
    ${(props) =>
      props.isXSMobile ? props.theme.spacing[8] : props.theme.spacing[12]};
`
