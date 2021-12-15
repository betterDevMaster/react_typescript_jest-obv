import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Button from 'lib/ui/Button'
import Icon from 'lib/ui/Button'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import {IconTemplate} from 'lib/ui/Icon/Icon.stories'

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
  <Button {...args}>
    <>
      <IconTemplate
        {...PrimaryIcon.args}
        iconSize={PrimaryIcon.args?.iconSize || 24}
        color={args.color}
      />
      Button
    </>
  </Button>
)

export const Primary = Template.bind({})
Primary.args = {
  variant: 'contained',
  color: 'primary',
}

const PrimaryIcon = IconTemplate.bind({})
PrimaryIcon.args = {
  color: 'danger',
  className: 'fab fa-facebook',
  iconSize: 20,
}
