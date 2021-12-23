import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Sidebar from 'lib/ui/Sidebar'

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
} as ComponentMeta<typeof Sidebar>

export const IconTemplate: ComponentStory<typeof Sidebar> = (args) => (
  <Sidebar {...args} />
)
