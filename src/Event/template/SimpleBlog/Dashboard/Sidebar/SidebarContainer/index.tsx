import Button from '@material-ui/core/Button'
import {useEditComponent} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import {useTemplate} from 'Event/TemplateProvider'
import {SimpleBlog} from 'Event/template/SimpleBlog'
import BackgroundImage from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer/BackgroundImage'

export const SIDEBAR_CONTAINER = 'Sidebar'

export default function SidebarContainer(props: {children: React.ReactNode}) {
  const edit = useEditComponent({type: SIDEBAR_CONTAINER})
  const {sidebar} = useTemplate()

  return (
    <Box {...sidebar}>
      <BackgroundImage />
      <TopLayer>
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
      </TopLayer>
    </Box>
  )
}

const Box = styled.div<SimpleBlog['sidebar']>`
  background: ${(props) => props.background};
  position: relative;
  overflow: hidden;
  padding: ${(props) => `${props.theme.spacing[12]} ${props.theme.spacing[8]}`};
  /* Show overflow to allow ticket ribbon outside of sidebar effect */
  overflow: visible;
  ${(props) =>
    props.paddingTop !== undefined
      ? `padding-top: ${props.paddingTop}px;`
      : `${props.theme.spacing[12]}px`}
  border-radius: ${(props) => props.borderRadius}px;
  border: ${(props) => props.borderWidth}px solid
    ${(props) => props.borderColor};
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 100%;
  }
`

const TopLayer = styled.div`
  position: relative;
  z-index: 2;
`

const EditSidebarButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
