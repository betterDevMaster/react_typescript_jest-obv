import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Button from 'lib/ui/Button'
import {IconTemplate} from 'lib/ui/Icon/Icon.stories'
import Icon from 'lib/ui/Icon'

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

const Base: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>Button</Button>
)

export const BaseButton = Base.bind({})
BaseButton.args = {
  variant: 'contained',
  color: 'primary',
}

const ButtonWithIcon: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>
    <Icon {...AddIcon.args} />
    Upload
  </Button>
)

export const UploadButton = ButtonWithIcon.bind({})
UploadButton.args = {
  variant: 'contained',
  color: 'primary',
}

const AddIcon = IconTemplate.bind({})

AddIcon.args = {
  className: 'far fa-arrow-circle-up',
}
