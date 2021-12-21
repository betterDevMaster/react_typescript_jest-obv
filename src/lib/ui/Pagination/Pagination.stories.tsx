import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Pagination from 'lib/ui/Pagination'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/Pagination',
  component: Pagination,
  argTypes: {
    count: {
      control: {type: 'number'},
    },
    page: {
      control: {type: 'number'},
    },
    disabled: {
      control: {type: 'boolean'},
    },
  },
} as ComponentMeta<typeof Pagination>

const Template: ComponentStory<typeof Pagination> = (args) => (
  <ThemeProvider>
    <Pagination {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  count: 10,
}
