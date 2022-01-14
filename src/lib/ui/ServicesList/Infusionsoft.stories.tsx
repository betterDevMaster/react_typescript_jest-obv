import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import Infusionsoft from 'lib/ui/ServicesList/Infusionsoft'

export default {
  title: 'Components/ServicesList/Infusionsoft',
  component: Infusionsoft,
  argTypes: {},
} as ComponentMeta<typeof Infusionsoft>

const Template: ComponentStory<typeof Infusionsoft> = (args) => (
  <ThemeProvider>
    <Infusionsoft {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
