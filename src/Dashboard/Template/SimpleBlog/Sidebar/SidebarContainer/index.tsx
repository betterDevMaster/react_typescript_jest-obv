import {useCurrent} from 'Dashboard/edit/state/edit-mode'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import React from 'react'
import styled from 'styled-components'

export const SIDEBAR_CONTAINER = 'Sidebar'

type Background = SimpleBlog['sidebar']['background']
type TextColor = SimpleBlog['sidebar']['textColor']

export default function SidebarContainer(props: {
  background: Background
  textColor: TextColor
  children: React.ReactNode
}) {
  const background = useCurrent(
    (state) => state.dashboardEditor.sidebar?.background,
    props.background,
  )
  const textColor = useCurrent(
    (state) => state.dashboardEditor.sidebar?.textColor,
    props.textColor,
  )

  return (
    <EditComponent type={SIDEBAR_CONTAINER}>
      <Box backgroundColor={background} textColor={textColor}>
        {props.children}
      </Box>
    </EditComponent>
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
