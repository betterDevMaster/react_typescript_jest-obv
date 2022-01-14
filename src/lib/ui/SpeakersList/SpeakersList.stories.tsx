import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import SpeakersList from 'lib/ui/SpeakersList'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/SpeakersList',
  component: SpeakersList,
  argTypes: {},
} as ComponentMeta<typeof SpeakersList>

const Template: ComponentStory<typeof SpeakersList> = (args) => (
  <ThemeProvider>
    <SpeakersList {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  speakers: [
    {
      name: 'Blue Melnick',
    },
    {
      name: 'Blue Melnick',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      name: 'Blue Melnick',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ],
}
