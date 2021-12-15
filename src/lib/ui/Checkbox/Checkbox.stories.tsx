import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Checkbox from 'lib/ui/Checkbox'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {},
} as ComponentMeta<typeof Checkbox>

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
