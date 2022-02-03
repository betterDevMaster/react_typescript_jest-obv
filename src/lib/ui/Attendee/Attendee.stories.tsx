import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Attendee from 'lib/ui/Attendee'
import {
  fakeArea,
  fakeRoomAssignment,
} from 'organization/Event/AreaList/__utils__/factory'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

export default {
  title: 'Components/Attendee',
  component: Attendee,
  argTypes: {},
} as ComponentMeta<typeof Attendee>

const Template: ComponentStory<typeof Attendee> = (args) => (
  <Attendee {...args} />
)

export const Primary = Template.bind({})

const areas = Array.from({length: 50}, fakeArea)

const attendee = fakeAttendee()
const roomAssignments = Array.from({length: 50}, fakeRoomAssignment)

Primary.args = {
  attendee,
  areas,
  currentPoints: 1234,
  roomAssignments,
}
