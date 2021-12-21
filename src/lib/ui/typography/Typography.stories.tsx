import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import {Title, Description, SubHead, Label} from 'lib/ui/typography'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'

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
  <ThemeProvider>
    <Title {...args}>Title</Title>
  </ThemeProvider>
)

const DescriptionTemplate: ComponentStory<typeof Description> = (args) => (
  <ThemeProvider>
    <Description {...args}>Description</Description>
  </ThemeProvider>
)

const SubHeadTemplate: ComponentStory<typeof SubHead> = (args) => (
  <ThemeProvider>
    <SubHead {...args}>SubHead</SubHead>
  </ThemeProvider>
)

const LabelTemplate: ComponentStory<typeof Label> = (args) => (
  <ThemeProvider>
    <Label {...args}>Label</Label>
  </ThemeProvider>
)

export const TitleTypography = TitleTemplate.bind({})
export const DescriptionTypography = DescriptionTemplate.bind({})
export const SubHeadTypography = SubHeadTemplate.bind({})
export const LabelTypography = LabelTemplate.bind({})
