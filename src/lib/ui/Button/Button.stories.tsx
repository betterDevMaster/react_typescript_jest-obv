import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Button from 'lib/ui/Button'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    variant: {
      options: ['text', 'contained', 'outlined'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => (
  <ThemeProvider>
    <Button {...args}>Button</Button>
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  variant: 'contained',
  color: 'primary',
}
