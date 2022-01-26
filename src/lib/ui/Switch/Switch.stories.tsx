import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Switch from 'lib/ui/Switch'

export default {
  title: 'Components/Switch',
  component: Switch,
  argTypes: {},
} as ComponentMeta<typeof Switch>

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />

export const Primary = Template.bind({})
Primary.args = {}
