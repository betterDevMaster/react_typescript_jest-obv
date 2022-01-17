import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import TextField from 'lib/ui/TextField'

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
  <TextField {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  value: 'Text Input',
}
