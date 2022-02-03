import Button from '@material-ui/core/Button'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import {Cards, useCardsTemplate} from 'Event/template/Cards'
import BackgroundImage from 'Event/template/Cards/Dashboard/Sidebar/SidebarContainer/BackgroundImage'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import Published from 'Event/Dashboard/editor/views/Published'
import {useToggle} from 'lib/toggle'
import {SidebarContainerConfig} from 'Event/template/Cards/Dashboard/Sidebar/SidebarContainer/SidebarContainerConfig'
import {SectionBox} from 'Event/template/Cards/Dashboard/Sidebar/Section'

export type Sidebar = Publishable & {
  background: string
  textColor: string
  borderRadius: number
  borderWidth: number
  borderColor: string
  paddingTop?: number
  separatorColor?: string
  separatorThickness?: number
  separatorStyle?: 'solid' | 'dashed' | 'dotted'
  headBackgroundColor?: string
  headBackgroundBorder?: number
  headTextColor?: string
}

export default function SidebarContainer(props: {children: React.ReactNode}) {
  const {sidebar} = useCardsTemplate()

  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <>
      <EditModeOnly>
        <SidebarContainerConfig
          isVisible={configVisible}
          onClose={toggleConfig}
        />
      </EditModeOnly>
      <Published component={sidebar}>
        <Box {...sidebar}>
          <TopLayer>
            <EditModeOnly>
              <SectionBox disablePaddingTop>
                <Button
                  onClick={toggleConfig}
                  fullWidth
                  size="large"
                  variant="contained"
                  color="secondary"
                  aria-label="edit sidebar"
                >
                  Edit Sidebar
                </Button>
              </SectionBox>
            </EditModeOnly>
            {props.children}
          </TopLayer>
          <BackgroundImage />
        </Box>
      </Published>
    </>
  )
}

const Box = styled.div<Cards['sidebar']>`
  background: ${(props) => props.background};
  position: relative;
  padding: ${(props) => `${props.theme.spacing[12]} 0`};
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
