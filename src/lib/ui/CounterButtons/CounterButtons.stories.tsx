import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import CounterButtons from 'lib/ui/CounterButtons'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/CounterButtons',
  component: CounterButtons,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    variant: {
      options: ['text', 'contained', 'outlined'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof CounterButtons>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CounterButtons> = (args) => (
  <ThemeProvider>
    <CounterButtons {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
