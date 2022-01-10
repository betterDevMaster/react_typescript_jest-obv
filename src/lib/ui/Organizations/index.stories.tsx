import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import Organizations, {ViewType} from 'lib/ui/Organizations'

import Avatar1 from 'assets/images/ui/organizations/1.png'
import Avatar2 from 'assets/images/ui/organizations/2.png'
import Avatar3 from 'assets/images/ui/organizations/3.png'
import Avatar4 from 'assets/images/ui/organizations/4.png'

export default {
  title: 'Components/Organizations',
  component: Organizations,
  argTypes: {
    viewType: {
      options: [0, 1],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof Organizations>

const Template: ComponentStory<typeof Organizations> = (args) => (
  <ThemeProvider>
    <Organizations {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  viewType: ViewType.LIST,
  organizations: [
    {
      name: 'Tony Robbins',
      avatar: Avatar1,
    },
    {
      name: 'Advent',
      avatar: Avatar2,
    },
    {
      name: 'Obvio',
      avatar: Avatar3,
    },
    {
      name: 'Miro',
      avatar: Avatar4,
    },
    {
      name: 'Obvio2',
      avatar: Avatar3,
    },
    {
      name: 'Miro2',
      avatar: Avatar4,
    },
  ],
}
