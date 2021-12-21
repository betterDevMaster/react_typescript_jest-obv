import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ConfigPanel from 'lib/ui/ConfigPanel'

export default {
  title: 'Components/ConfigPanel',
  component: ConfigPanel,
  argTypes: {
    open: {
      type: 'boolean',
    },
  },
} as ComponentMeta<typeof ConfigPanel>

export const Template: ComponentStory<typeof ConfigPanel> = (args) => (
  <ConfigPanel {...args} />
)

export const DefaultConfigPanel = Template.bind({})

DefaultConfigPanel.args = {
  title: 'Main Nav Config',
  settings: <div>Main Nav Setting Page Here</div>,
  rules: <div>Main Nav Rules Page Here</div>,
  styling: <div>Main Nav Styling Page Here</div>,
  open: false,
}
