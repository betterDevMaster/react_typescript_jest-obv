import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import styled from 'styled-components'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import BlogPosts from 'Event/template/FiftyBlog/Dashboard/Home/BlogPosts'
import WelcomeTextConfig from 'Event/template/FiftyBlog/Dashboard/Home/WelcomeTextConfig'
import {PageTitle} from 'Event/template/FiftyBlog/Page'
import {useToggle} from 'lib/toggle'
import React from 'react'
import BodyHTMLEmbed from 'Event/template/FiftyBlog/Dashboard/Home/BodyHTMLEmbed'
import {useAttendeeVariables} from 'Event'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'

export default function Home() {
  const template = useFiftyBlogTemplate()
  const {flag: welcomeConfigVisible, toggle: toggleWelcomeConfig} = useToggle()
  const isEditMode = useEditMode()
  const v = useAttendeeVariables()

  return (
    <>
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
    </>
  )
}

const WelcomeText = styled(PageTitle)<{
  hasMinHeight: boolean
}>`
  ${(props) => (props.hasMinHeight ? 'min-height: 42px;' : '')}
`
