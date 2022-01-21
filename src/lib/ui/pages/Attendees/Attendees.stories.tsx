import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Attendees from 'lib/ui/pages/Attendees'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {
  fakeArea,
  fakeRoomAssignment,
} from 'organization/Event/AreaList/__utils__/factory'
import {RoomAssignment} from 'organization/Event/AttendeeManagement/AssignmentsDialog/RoomSelect'

export default {
  title: 'Pages/Attendees',
  component: Attendees,
  argTypes: {},
} as ComponentMeta<typeof Attendees>

const Template: ComponentStory<typeof Attendees> = (args) => (
  <Attendees {...args} />
)
export const Primary = Template.bind({})
const areas = Array.from({length: 10}, fakeArea)
const attendees = Array.from({length: 10}, fakeAttendee)

const roomAssignments: RoomAssignment[][] = attendees.map((a) => {
  const attendeeAreas = areas.map((area) => {
    return fakeRoomAssignment({
      area_id: area.id,
      attendee_id: a.id,
    })
  })
  return attendeeAreas
})

const currentPoints: number[] = Array.from({length: attendees.length}, () => {
  return 0
})

Primary.args = {
  attendees,
  areas,
  roomAssignments,
  currentPoints,
}
