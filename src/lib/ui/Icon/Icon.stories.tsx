import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Icon from 'lib/ui/Icon'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    color: {
      type: 'string',
      defaultValue: 'danger',
    },
    className: {
      type: 'string',
      defaultValue: 'fab fa-linkedin',
    },
    iconSize: {
      type: 'number',
      defaultValue: 24,
    },
  },
} as ComponentMeta<typeof Icon>

export const IconTemplate: ComponentStory<typeof Icon> = (args) => (
  <Icon {...args} />
)
