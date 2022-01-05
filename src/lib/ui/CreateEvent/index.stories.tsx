import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import CreateEvent from 'lib/ui/CreateEvent'

export default {
  title: 'Components/CreateEvent',
  component: CreateEvent,
  argTypes: {},
} as ComponentMeta<typeof CreateEvent>

const Template: ComponentStory<typeof CreateEvent> = (args) => (
  <ThemeProvider>
    <CreateEvent {...args} />
  </ThemeProvider>
)
export const Primary = Template.bind({})
Primary.args = {
  imageWidth: 300,
  imageHeight: 300,
  imageProcessing: false,
  imageAutoUpload: false,
  iconWidth: 100,
  iconHeight: 100,
  iconProcessing: false,
  iconAutoUpload: false,
}
