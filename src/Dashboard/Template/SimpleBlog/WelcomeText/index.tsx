import EditComponent from 'Dashboard/edit/views/EditComponent'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import styled from 'styled-components'

export const WELCOME_TEXT = 'Welcome Text'
export default function WelcomeText(props: {
  children: string
  isEditMode?: boolean
}) {
  const current = useSelector(
    (state: RootState) => state.dashboardEditor.welcomeText,
  )

  if (props.isEditMode && current) {
    return (
      <EditComponent type={WELCOME_TEXT}>
        <Text aria-label="welcome">{current}</Text>
      </EditComponent>
    )
  }

  return <Text aria-label="welcome">{props.children}</Text>
}

const Text = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
