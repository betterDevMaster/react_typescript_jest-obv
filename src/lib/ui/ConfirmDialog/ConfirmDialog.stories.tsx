import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ConfirmDialog from 'lib/ui/ConfirmDialog'
import {Typography, SubHead} from 'lib/ui/typography'
import PasswordField from 'lib/ui/TextField/PasswordField'

export default {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
} as ComponentMeta<typeof ConfirmDialog>

const Template: ComponentStory<typeof ConfirmDialog> = (args) => (
  <ConfirmDialog {...args} />
)

export const Primary = Template.bind({})

Primary.args = {
  title: 'Delete Event Confirmation',
  description:
    'This Event will permanently be deleted. There is no way of restoring an Event once deleted. Please confirm deletion by entering your accounts password below.',
}

export const ConfirmDialogWithPassword = Template.bind({})

ConfirmDialogWithPassword.args = {
  title: 'Delete Event Confirmation',
  description: (
    <>
      <SubHead>Tony Robbins</SubHead>
      <Typography fontSize={16} lineHeight={24}>
        This Event will permanently be deleted. There is no way of restoring an
        Event once deleted. Please confirm deletion by entering your accounts
        password below.
      </Typography>
      <SubHead>Enter Password</SubHead>
      <PasswordField fullWidth variant="outlined" />
    </>
  ),
  showing: true,
  buttonsDisplay: 'vertically',
  variant: 'info',
}
