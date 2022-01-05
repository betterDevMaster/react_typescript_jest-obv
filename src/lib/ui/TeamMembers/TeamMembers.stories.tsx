import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import TeamMembers from 'lib/ui/TeamMembers'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/TeamMembers',
  component: TeamMembers,
  argTypes: {},
} as ComponentMeta<typeof TeamMembers>

const Template: ComponentStory<typeof TeamMembers> = (args) => (
  <ThemeProvider>
    <TeamMembers {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  teamMembers: [
    {
      name: 'David Keller',
    },
    {
      name: 'Sheldon Frank',
    },
    {
      name: 'Lisa West',
    },
    {
      name: 'Rita Kim',
    },
    {
      name: 'Jerome Morrison',
    },
  ],
}
