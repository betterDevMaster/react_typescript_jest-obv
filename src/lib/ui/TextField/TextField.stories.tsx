import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import TextField from 'lib/ui/TextField'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/TextField',
  component: TextField,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    variant: {
      options: ['undefined', 'filled', 'outlined'],
      control: {type: 'radio'},
    },
    color: {
      options: ['undefined', 'default', 'white'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof TextField>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TextField> = (args) => (
  <ThemeProvider>
    <TextField {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  value: 'Text Input',
}
