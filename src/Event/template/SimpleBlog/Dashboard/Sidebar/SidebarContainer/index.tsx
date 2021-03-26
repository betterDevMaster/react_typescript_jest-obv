import Button from '@material-ui/core/Button'
import {useEditComponent} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import {useTemplate} from 'Event/TemplateProvider'
import {SimpleBlog} from 'Event/template/SimpleBlog'

export const SIDEBAR_CONTAINER = 'Sidebar'

type Background = SimpleBlog['sidebar']['background']
type TextColor = SimpleBlog['sidebar']['textColor']

export default function SidebarContainer(props: {
  background: Background
  textColor: TextColor
  children: React.ReactNode
}) {
  const edit = useEditComponent({type: SIDEBAR_CONTAINER})
  const {sidebar} = useTemplate()

  return (
    <Box sidebar={sidebar}>
      <EditModeOnly>
        <EditSidebarButton
          onClick={edit}
          fullWidth
          size="large"
          variant="contained"
          color="secondary"
          aria-label="edit sidebar"
        >
          Edit Sidebar
        </EditSidebarButton>
      </EditModeOnly>
      {props.children}
    </Box>
  )
}

const Box = styled.div<{
  sidebar: SimpleBlog['sidebar']
}>`
  background: ${(props) => props.sidebar.background};
  padding: ${(props) => `${props.theme.spacing[12]} ${props.theme.spacing[8]}`};
  color: ${(props) => props.sidebar.textColor};
  border-radius: ${(props) => props.sidebar.borderRadius}px;
  border: ${(props) => props.sidebar.borderWidth}px solid
    ${(props) => props.sidebar.borderColor};
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 100%;
  }

  a {
    color: ${(props) => props.sidebar.textColor};
  }
`

const EditSidebarButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
