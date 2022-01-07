import React from 'react'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import styled from 'styled-components'

import {useTheme, useMediaQuery} from '@material-ui/core'

import {useAttendeeVariables} from 'Event'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import BlogPosts from 'Event/template/NiftyFifty/Dashboard/Home/BlogPosts'
import WelcomeTextConfig from 'Event/template/NiftyFifty/Dashboard/Home/WelcomeTextConfig'
import {PageTitle} from 'Event/template/NiftyFifty/Page'
import BodyHTMLEmbed from 'Event/template/NiftyFifty/Dashboard/Home/BodyHTMLEmbed'

import {useToggle} from 'lib/toggle'

export default function Home() {
  const template = useNiftyFiftyTemplate()
  const {flag: welcomeConfigVisible, toggle: toggleWelcomeConfig} = useToggle()
  const isEditMode = useEditMode()
  const v = useAttendeeVariables()
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Paper isXSMobile={isXSMobile}>
      <EditModeOnly>
        <WelcomeTextConfig
          isVisible={welcomeConfigVisible}
          onClose={toggleWelcomeConfig}
        />
      </EditModeOnly>
      <Editable onEdit={toggleWelcomeConfig}>
        <WelcomeText hasMinHeight={isEditMode} aria-label="welcome">
          {v(template.welcomeText)}
        </WelcomeText>
      </Editable>
      <BlogPosts />
      <BodyHTMLEmbed />
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

const WelcomeText = styled(PageTitle)<{
  hasMinHeight: boolean
}>`
  ${(props) => (props.hasMinHeight ? 'min-height: 42px;' : '')}
`
