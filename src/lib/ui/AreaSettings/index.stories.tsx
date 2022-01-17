import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import AreaSettings from 'lib/ui/AreaSettings'

export default {
  title: 'Components/AreaSettings',
  component: AreaSettings,
  argTypes: {},
} as ComponentMeta<typeof AreaSettings>

const Template: ComponentStory<typeof AreaSettings> = (args) => (
  <ThemeProvider>
    <AreaSettings {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  open: true,
  reassignOnOffline: false,
  requireApproval: true,
  joinMultipleDevices: true,
  rooms: [
    {
      name: '1',
      maxAttendees: 200,
      disabled: false,
    },
    {
      name: '2',
      maxAttendees: 200,
      disabled: true,
    },
    {
      name: '3',
      maxAttendees: 100,
      disabled: false,
    },
    {
      name: '4',
      maxAttendees: 50,
      disabled: false,
    },
  ],
}
