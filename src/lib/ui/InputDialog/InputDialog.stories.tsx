import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import InputDialog from 'lib/ui/InputDialog'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/InputDialog',
  component: InputDialog,
  argTypes: {},
} as ComponentMeta<typeof InputDialog>

const Template: ComponentStory<typeof InputDialog> = (args) => (
  <ThemeProvider>
    <InputDialog {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  title: 'Add/Edit FAQ',
  open: true,
}
