import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Accordion from 'lib/ui/Accordion'
import AccordionDetails from 'lib/ui/Accordion/AccordionDetails'
import AccordionSummary from 'lib/ui/Accordion/AccordionSummary'
import {SubHead, Label} from 'lib/ui/typography'
import Counter from 'lib/ui/Counter'
import Box, {TopBottomBorderBox} from 'lib/ui/Box'

export default {
  title: 'Components/Accordion',
  component: Accordion,
} as ComponentMeta<typeof Accordion>

const AccordionTemplate: ComponentStory<typeof Accordion> = (args) => (
  <Accordion {...args}>
    <AccordionSummary>
      <SubHead>Accordion 1</SubHead>
    </AccordionSummary>
    <AccordionDetails>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      malesuada lacus ex, sit amet blandit leo lobortis eget.
    </AccordionDetails>
  </Accordion>
)

export const Primary = AccordionTemplate.bind({})

Primary.args = {
  expanded: false,
  id: 'accordion-1',
}

export const PointItem: ComponentStory<typeof Accordion> = (args) => (
  <Accordion {...args}>
    <AccordionSummary>
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
