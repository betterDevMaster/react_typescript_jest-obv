import React from 'react'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import SidebarNavButton from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarNav/SidebarNavButton'

export default function SidebarNav(props: {
  buttons: SimpleBlog['sidebarNavButtons']
  buttonColor: string
  container?: React.FunctionComponent<any>
}) {
  const hasButtons = props.buttons.ids.length > 0
  if (!hasButtons) {
    return null
  }

  const Component = props.container || 'div'

  return (
    <Component>
      {props.buttons.ids.map((id) => {
        const button = props.buttons.entities[id]
        return (
          <SidebarNavButton
            key={id}
            {...button}
            backgroundColor={props.buttonColor}
          />
        )
      })}
    </Component>
  )
}
