import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import TextArea from 'lib/ui/TextArea'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/TextArea',
  component: TextArea,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TextArea>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const CKEditorTemplate: ComponentStory<typeof TextArea> = (args) => (
  <TextArea {...args} />
)

CKEditorTemplate.bind({})
