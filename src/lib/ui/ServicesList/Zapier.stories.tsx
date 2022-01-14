import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import Zapier from 'lib/ui/ServicesList/Zapier'

export default {
  title: 'Components/ServicesList/Zapier',
  component: Zapier,
  argTypes: {},
} as ComponentMeta<typeof Zapier>

const Template: ComponentStory<typeof Zapier> = (args) => (
  <ThemeProvider>
    <Zapier {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  link: 'https://zapier.com/',
}
