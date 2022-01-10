import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import AppBar from 'lib/ui/AppBar'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

export default {
  title: 'Components/AppBar',
  component: AppBar,
  argTypes: {
    home: {
      type: 'string',
      defaultValue: '/',
    },
    user: {
      email: {
        type: 'string',
      },
    },
  },
} as ComponentMeta<typeof AppBar>

export const AppBarTemplate: ComponentStory<typeof AppBar> = (args) => (
  <AppBar {...args} />
)
AppBarTemplate.args = {
  homeLinkTarget: '/',
  user: fakeTeamMember(),
}
