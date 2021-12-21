import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import TextField from 'lib/ui/TextField'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/TextField',
  component: TextField,
  argTypes: {
    variant: {
      options: ['filled', 'outlined'],
      control: {type: 'radio'},
    },
    color: {
      options: ['default', 'white'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof TextField>

const Template: ComponentStory<typeof TextField> = (args) => (
  <ThemeProvider>
    <TextField {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  value: 'Text Input',
}
