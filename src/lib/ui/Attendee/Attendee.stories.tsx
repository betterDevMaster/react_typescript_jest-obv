import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Attendee from 'lib/ui/Attendee'

export default {
  title: 'Components/Attendee',
  component: Attendee,
  argTypes: {},
} as ComponentMeta<typeof Attendee>

const Template: ComponentStory<typeof Attendee> = (args) => (
  <Attendee {...args} />
)

export const Primary = Template.bind({})

const rooms = [
  {
    label: 'Not Assigned',
    value: 'not assigned',
  },
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3',
    value: 3,
  },
]

Primary.args = {
  email: 'Christopherkuchta@gmail.com',
  currentPoints: 1234,
  rooms,
  areas: [
    {
      id: 1,
      label: 'Tech Check',
      room: rooms[0],
    },
    {
      id: 2,
      label: 'Main Stage',
      room: rooms[1],
    },
    {
      id: 2,
      label: 'Help Desk',
      room: rooms[2],
    },
  ],
}
