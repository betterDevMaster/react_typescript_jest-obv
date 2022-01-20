import React, {useState, useEffect} from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Accordion from 'lib/ui/Accordion'
import AccordionDetails from 'lib/ui/Accordion/AccordionDetails'
import AccordionSummary from 'lib/ui/Accordion/AccordionSummary'
import {SubHead, Label} from 'lib/ui/typography'
import Counter from 'lib/ui/Counter'
import Box, {TopBottomBorderBox} from 'lib/ui/Box'
import Heading3 from 'lib/ui/typography/Heading3'

export default {
  title: 'Components/Accordion',
  component: Accordion,
} as ComponentMeta<typeof Accordion>

const AccordionTemplate: ComponentStory<typeof Accordion> = (args) => (
  <Accordion {...args}>
    <AccordionSummary expandedIconName="chevron">
      <SubHead>Accordion 1</SubHead>
    </AccordionSummary>
    <AccordionDetails>
      <Box fullWidth m={2}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </Box>
    </AccordionDetails>
  </Accordion>
)

export const Primary = AccordionTemplate.bind({})

export const PointItem: ComponentStory<typeof Accordion> = (args) => (
  <Accordion {...args}>
    <AccordionSummary expandedIconName="menu">
      <SubHead>Creating Your Password</SubHead>
    </AccordionSummary>
    <AccordionDetails>
      <TopBottomBorderBox>
        <Box fullWidth mb={2}>
          <Label>Points earned</Label>
        </Box>
        <Box fullWidth>
          <Counter />
        </Box>
      </TopBottomBorderBox>
      <TopBottomBorderBox>
        <Box fullWidth mb={2}>
          <Label>Max Per Day</Label>
        </Box>
        <Box fullWidth>
          <Counter />
        </Box>
      </TopBottomBorderBox>
    </AccordionDetails>
  </Accordion>
)
export const FaqItem: ComponentStory<typeof Accordion> = (args) => {
  const [expanded, setExpanded] = useState(args.expanded || false)

  useEffect(() => {
    setExpanded(args.expanded || false)
  }, [args.expanded])

  return (
    <Accordion {...args} expanded={expanded}>
      <AccordionSummary
        expandedIconName="plus"
        expanded={expanded}
        activeColor="primary"
      >
        <Heading3>Creating Your Password</Heading3>
      </AccordionSummary>
      <AccordionDetails>
        <Box fullWidth m={2}>
          FAQ ANSWER dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut laboreadipiscing elit, sed do eiusmod tempor
          incididunt ut labore
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
