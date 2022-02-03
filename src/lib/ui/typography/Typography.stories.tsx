import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import {
  Title,
  Description,
  SubHead,
  Label,
  ErrorMessage,
} from 'lib/ui/typography'

export default {
  title: 'Components/Typography',
  component: Title,
  argTypes: {
    white: {
      control: {type: 'boolean'},
    },
  },
} as ComponentMeta<typeof Title>

const TitleTemplate: ComponentStory<typeof Title> = (args) => (
  <Title {...args}>Title</Title>
)

const DescriptionTemplate: ComponentStory<typeof Description> = (args) => (
  <Description {...args}>Description</Description>
)

const SubHeadTemplate: ComponentStory<typeof SubHead> = (args) => (
  <SubHead {...args}>SubHead</SubHead>
)

const LabelTemplate: ComponentStory<typeof Label> = (args) => (
  <Label {...args}>Label</Label>
)

const ErrorMessageTemplate: ComponentStory<typeof ErrorMessage> = (args) => (
  <ErrorMessage {...args}>Error</ErrorMessage>
)

export const TitleTypography = TitleTemplate.bind({})
export const DescriptionTypography = DescriptionTemplate.bind({})
export const SubHeadTypography = SubHeadTemplate.bind({})
export const LabelTypography = LabelTemplate.bind({})
export const ErrorMessageTypography = ErrorMessageTemplate.bind({})
