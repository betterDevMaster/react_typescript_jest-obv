import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import Forms from 'lib/ui/Forms'

export default {
  title: 'Components/Forms',
  component: Forms,
  argTypes: {},
} as ComponentMeta<typeof Forms>

const Template: ComponentStory<typeof Forms> = (args) => (
  <ThemeProvider>
    <Forms {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  forms: [
    {
      name: 'Waiver',
    },
    {
      name: 'Voting on Fav Color',
    },
    {
      name: 'Workshop 1 Point',
    },
  ],
}
