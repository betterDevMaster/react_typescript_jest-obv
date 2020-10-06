import {Editable} from 'Dashboard'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import styled from 'styled-components'

export const SIDEBAR_CONTAINER = 'Sidebar'

type Background = SimpleBlog['sidebar']['background']
type TextColor = SimpleBlog['sidebar']['textColor']

export default function SidebarContainer(
  props: {
    background: Background
    textColor: TextColor
    children: React.ReactNode
  } & Editable,
) {
  const background = useCurrentBackground(props.isEditMode, props.background)
  const textColor = useCurrentTextColor(props.isEditMode, props.textColor)

  return (
    <EditComponent type={SIDEBAR_CONTAINER} isEditMode={props.isEditMode}>
      <Box backgroundColor={background} textColor={textColor}>
        {props.children}
      </Box>
    </EditComponent>
  )
}

function useCurrentBackground(isEditMode: boolean, saved: Background) {
  const current = useSelector(
    (state: RootState) => state.dashboardEditor.sidebar?.background,
  )

  if (!isEditMode || !current) {
    return saved
  }

  return current
}

function useCurrentTextColor(isEditMode: boolean, saved: TextColor) {
  const current = useSelector(
    (state: RootState) => state.dashboardEditor.sidebar?.textColor,
  )

  if (!isEditMode || !current) {
    return saved
  }

  return current
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
