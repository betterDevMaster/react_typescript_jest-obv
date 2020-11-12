import Button from '@material-ui/core/Button'
import {useEditComponent} from 'organization/event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'organization/event/Dashboard/editor/views/EditModeOnly'
import {SimpleBlog} from 'organization/event/Dashboard/Template/SimpleBlog'
import React from 'react'
import styled from 'styled-components'
import {useDashboard} from 'organization/event/Dashboard/state/DashboardProvider'

export const SIDEBAR_CONTAINER = 'Sidebar'

type Background = SimpleBlog['sidebar']['background']
type TextColor = SimpleBlog['sidebar']['textColor']

export default function SidebarContainer(props: {
  background: Background
  textColor: TextColor
  children: React.ReactNode
}) {
  const edit = useEditComponent({type: SIDEBAR_CONTAINER})
  const {sidebar} = useDashboard()

  return (
    <Box backgroundColor={sidebar.background} textColor={sidebar.textColor}>
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

const Box = styled.div<{backgroundColor: string; textColor: string}>`
  background: ${(props) => props.backgroundColor};
  padding: ${(props) => `${props.theme.spacing[12]} ${props.theme.spacing[8]}`};
  color: ${(props) => props.textColor};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 100%;
  }

  a {
    color: ${(props) => props.textColor};
  }
`

const EditSidebarButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
