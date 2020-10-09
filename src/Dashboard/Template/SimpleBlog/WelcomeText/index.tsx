import {useEditMode} from 'Dashboard/edit/state/edit-mode'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import styled from 'styled-components'

export const WELCOME_TEXT = 'Welcome Text'
export default function WelcomeText(props: {children: string}) {
  const isEditMode = useEditMode()
  const current = useSelector(
    (state: RootState) => state.dashboardEditor.welcomeText,
  )

  const value = isEditMode && current ? current : props.children
  return <Text aria-label="welcome">{value}</Text>
}

const Text = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
