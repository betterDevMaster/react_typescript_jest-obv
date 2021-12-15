import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ImageUploader from 'lib/ui/ImageUploader'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

export default {
  title: 'Components/ImageUploader',
  component: ImageUploader,
} as ComponentMeta<typeof ImageUploader>

// Can add icon story here.
const Template: ComponentStory<typeof ImageUploader> = (args) => (
  <ThemeProvider>
    <ImageUploader {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  label: 'Please select image',
  width: 100,
  height: 100,
  processing: false,
  autoUpload: false,
}
