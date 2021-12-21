import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Select from 'lib/ui/Select'
import Option from 'lib/ui/Select/Option'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/Select',
  component: Select,
  argTypes: {},
} as ComponentMeta<typeof Select>

const Template: ComponentStory<typeof Select> = (args) => (
  <ThemeProvider>
    <Select {...args}>
      <Option value={1} dark={args.dark}>
        One
      </Option>
      <Option value={2} dark={args.dark}>
        Two
      </Option>
    </Select>
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  label: 'Select',
  value: 1,
}
