import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Checkbox from 'lib/ui/Checkbox'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof Checkbox>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Checkbox> = (args) => (
  <ThemeProvider>
    <Checkbox {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  label: 'Checkbox',
  checked: true,
}
