import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Speaker from 'lib/ui/SpeakersList/Speaker'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/Speaker',
  component: Speaker,
  argTypes: {},
} as ComponentMeta<typeof Speaker>

const Template: ComponentStory<typeof Speaker> = (args) => (
  <ThemeProvider>
    <Speaker {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  name: 'Blue Melnick',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
}
