import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Permissions from 'lib/ui/TeamMembers/Permissions'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/TeamMembers/Permissions',
  component: Permissions,
  argTypes: {},
} as ComponentMeta<typeof Permissions>

const Template: ComponentStory<typeof Permissions> = (args) => (
  <ThemeProvider>
    <Permissions {...args} />
  </ThemeProvider>
)

export const PermissionsPrimary = Template.bind({})
PermissionsPrimary.args = {
  teamMembers: [
    {
      name: 'Blue',
      permissions: {
        configure_event: true,
        handle_tech_check: false,
      },
    },
    {
      name: 'Mike',
      permissions: {
        configure_event: true,
        handle_tech_check: true,
      },
    },
    {
      name: 'Chris',
      permissions: {
        configure_event: false,
        handle_tech_check: true,
      },
    },
  ],
}
