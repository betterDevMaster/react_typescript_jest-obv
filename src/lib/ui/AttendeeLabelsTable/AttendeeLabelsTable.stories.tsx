import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import AttendeeLabelsTable from 'lib/ui/AttendeeLabelsTable'

export default {
  title: 'Components/AttendeeLabelsTable',
  component: AttendeeLabelsTable,
  argTypes: {},
} as ComponentMeta<typeof AttendeeLabelsTable>

const Template: ComponentStory<typeof AttendeeLabelsTable> = (args) => (
  <AttendeeLabelsTable {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  attendeeLabels: [
    {
      priority: 1,
      label: 'G1',
      hasVisibilityRules: false,
    },
    {
      priority: 2,
      label: 'G2',
      hasVisibilityRules: true,
    },
    {
      priority: 3,
      label: 'G3',
      hasVisibilityRules: true,
    },
  ],
}
