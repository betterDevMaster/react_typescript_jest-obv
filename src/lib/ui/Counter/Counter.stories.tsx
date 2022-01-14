import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import CounterButtons from 'lib/ui/Counter'

export default {
  title: 'Components/CounterButtons',
  component: CounterButtons,
} as ComponentMeta<typeof CounterButtons>

const Template: ComponentStory<typeof CounterButtons> = (args) => (
  <CounterButtons {...args} />
)

export const Base = Template.bind({})
