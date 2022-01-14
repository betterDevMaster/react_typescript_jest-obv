import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import TeamMember from 'lib/ui/TeamMembers/TeamMember'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/TeamMembers',
  component: TeamMember,
  argTypes: {},
} as ComponentMeta<typeof TeamMember>

const Template: ComponentStory<typeof TeamMember> = (args) => (
  <ThemeProvider>
    <TeamMember {...args} />
  </ThemeProvider>
)

export const TeamMemberPrimary = Template.bind({})
TeamMemberPrimary.args = {
  teamMember: {name: 'David Keller'},
  isOdd: false,
}
