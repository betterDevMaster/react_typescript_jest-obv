import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import PasswordField from 'lib/ui/TextField/PasswordField'

export default {
  title: 'Components/PasswordField',
  component: PasswordField,
  argTypes: {
    helperText: {
      control: {type: 'text'},
    },
    error: {
      options: [true, false],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof PasswordField>

const Template: ComponentStory<typeof PasswordField> = (args) => (
  <PasswordField {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  value: 'Password',
}
