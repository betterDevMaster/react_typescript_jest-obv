import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import AddForm from 'lib/ui/Forms/AddForm'

export default {
  title: 'Components/Forms/AddForm',
  component: AddForm,
  argTypes: {},
} as ComponentMeta<typeof AddForm>

const Template: ComponentStory<typeof AddForm> = () => (
  <ThemeProvider>
    <AddForm />
  </ThemeProvider>
)

export const Primary = Template.bind({})
