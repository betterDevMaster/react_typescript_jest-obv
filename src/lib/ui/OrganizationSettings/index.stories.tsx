import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import OrganizationSettings from 'lib/ui/OrganizationSettings'

export default {
  title: 'Components/OrganizationSettings',
  component: OrganizationSettings,
  argTypes: {},
} as ComponentMeta<typeof OrganizationSettings>

const Template: ComponentStory<typeof OrganizationSettings> = (args) => (
  <OrganizationSettings {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  firstName: 'Christopher',
  lastName: 'Kuchta',
  email: 'christopher@obv.io',
}
