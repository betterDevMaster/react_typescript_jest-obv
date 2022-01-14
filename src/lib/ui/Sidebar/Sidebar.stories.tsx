import React, {useState} from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Sidebar from 'lib/ui/Sidebar'
import AppBar from 'lib/ui/AppBar'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
} as ComponentMeta<typeof Sidebar>

export const Primary: ComponentStory<typeof Sidebar> = (args) => (
  <Sidebar {...args} />
)

export const SidebarWithAppBar: ComponentStory<typeof Sidebar> = (args) => {
  const [collapseSidebar, setCollapseSidebar] = useState(true)
  return (
    <>
      <AppBar
        user={fakeTeamMember()}
        logout={() => {}}
        homeLinkTarget="/"
        collapsableSidebar={setCollapseSidebar}
        collapsedSidebar={collapseSidebar}
      />
      <Sidebar {...args} isCollapsed={collapseSidebar} />
    </>
  )
}
