import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import PointsConfig from 'lib/ui/PointsConfig'

export default {
  title: 'Components/PointsConfig',
  component: PointsConfig,
  argTypes: {},
} as ComponentMeta<typeof PointsConfig>

const Template: ComponentStory<typeof PointsConfig> = () => (
  <ThemeProvider>
    <PointsConfig />
  </ThemeProvider>
)

export const Primary = Template.bind({})
