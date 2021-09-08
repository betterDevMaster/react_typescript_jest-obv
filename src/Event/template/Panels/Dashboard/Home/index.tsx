import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import styled from 'styled-components'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {usePanels} from 'Event/template/Panels'
import BlogPosts from 'Event/template/Panels/Dashboard/Home/BlogPosts'
import WelcomeTextConfig from 'Event/template/Panels/Dashboard/Home/WelcomeTextConfig'
import {PageTitle} from 'Event/template/Panels/Page'
import {useToggle} from 'lib/toggle'
import React from 'react'
import BodyHTMLEmbed from 'Event/template/Panels/Dashboard/Home/BodyHTMLEmbed'
import {useAttendeeVariables} from 'Event'

export default function Home() {
  const {template} = usePanels()
  const {flag: welcomeConfigVisible, toggle: toggleWelcomeConfig} = useToggle()

  const isEditMode = useEditMode()
  const v = useAttendeeVariables()

  return (
    <>
      <WelcomeTextConfig
        isVisible={welcomeConfigVisible}
        onClose={toggleWelcomeConfig}
      />
      <Editable onEdit={toggleWelcomeConfig}>
        <WelcomeText hasMinHeight={isEditMode} aria-label="welcome">
          {v(template.welcomeText)}
        </WelcomeText>
      </Editable>
      <BlogPosts />
      <BodyHTMLEmbed />
    </>
  )
}

const WelcomeText = styled(PageTitle)<{
  hasMinHeight: boolean
}>`
  ${(props) => (props.hasMinHeight ? 'min-height: 42px;' : '')}
`
