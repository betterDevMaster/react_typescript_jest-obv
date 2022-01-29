import React from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import {useAttendeeVariables} from 'Event'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useToggle} from 'lib/toggle'
import {Ordered} from 'lib/list'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import Content from 'lib/ui/form/TextEditor/Content'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {TextConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/Text/TextConfig'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'

export const TEXT = 'Text'

export interface TextProps extends Ordered {
  type: typeof TEXT
  padding: number
  body: string
}

export const createText = (): TextProps => ({
  type: TEXT,
  padding: 5,
  body: 'This is sample text.  Click Edit Text to modify this text.',
})

export default function Text(props: TextProps) {
  const {sidebar} = useSimpleBlogTemplate()
  const {body, padding} = props
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <Section>
      <Body aria-label="text" color={sidebar.textColor} padding={padding}>
        {v(body)}
      </Body>
      <EditModeOnly>
        <TextConfig
          isVisible={configVisible}
          onClose={toggleConfig}
          text={props}
        />
        <EditButton
          onClick={toggleConfig}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          aria-label="edit text"
        >
          Edit Text
        </EditButton>
        <RemoveTextButton />
      </EditModeOnly>
    </Section>
  )
}

function RemoveTextButton() {
  const {remove: removeItem} = useEditSidebarItem()
  return (
    <RemoveButton size="large" showing onClick={removeItem}>
      Remove Text
    </RemoveButton>
  )
}

const Body = styled(Content)<{
  color: string
  padding: number
}>`
  color: ${(props) => props.color};
  font-weight: bold;
  padding: ${(props) => props.padding}px;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    text-align: center;
  }

  a {
    color: ${(props) => props.color} !important;
  }
`

const EditButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`
