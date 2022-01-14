import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ImageUploader from 'lib/ui/ImageUploader'

export default {
  title: 'Components/ImageUploader',
  component: ImageUploader,
} as ComponentMeta<typeof ImageUploader>

// Can add icon story here.
const Template: ComponentStory<typeof ImageUploader> = (args) => (
  <ImageUploader {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  label: 'Upload a PNG or JPG under _mbs*',
  width: 100,
  height: 100,
  processing: false,
  autoUpload: false,
}
