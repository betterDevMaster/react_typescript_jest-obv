import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import ServicesList from 'lib/ui/ServicesList'

export default {
  title: 'Components/ServicesList',
  component: ServicesList,
  argTypes: {},
} as ComponentMeta<typeof ServicesList>

const Template: ComponentStory<typeof ServicesList> = (args) => (
  <ThemeProvider>
    <ServicesList />
  </ThemeProvider>
)

export const Primary = Template.bind({})
