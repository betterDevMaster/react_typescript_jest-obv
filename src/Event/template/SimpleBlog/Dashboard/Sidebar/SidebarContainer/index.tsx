import Button from '@material-ui/core/Button'
import {useEditComponent} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import {useTemplate} from 'Event/TemplateProvider'
import {SimpleBlog} from 'Event/template/SimpleBlog'
import BackgroundImage from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer/BackgroundImage'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import Published from 'Event/Dashboard/editor/views/Published'

export const SIDEBAR_CONTAINER = 'Sidebar'

export type Sidebar = Publishable & {
  background: string
  textColor: string
  borderRadius: number
  borderWidth: number
  borderColor: string
  paddingTop?: number
}

export default function SidebarContainer(props: {children: React.ReactNode}) {
  const edit = useEditComponent({type: SIDEBAR_CONTAINER})
  const {sidebar} = useTemplate()

  return (
    <Published component={sidebar}>
      <Box {...sidebar}>
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
        <BackgroundImage />
      </Box>
    </Published>
  )
}

const Box = styled.div<SimpleBlog['sidebar']>`
  background: ${(props) => props.background};
  position: relative;
  padding: ${(props) => `${props.theme.spacing[12]} ${props.theme.spacing[8]}`};
  ${(props) =>
    props.paddingTop !== undefined ? `padding-top: ${props.paddingTop}px;` : ``}
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
