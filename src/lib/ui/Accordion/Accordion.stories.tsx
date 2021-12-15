import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Accordion from 'lib/ui/Accordion'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import AccordionDetails from 'lib/ui/Accordion/AccordionDetails'
import AccordionSummary from 'lib/ui/Accordion/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default {
  title: 'Components/Accordion',
  component: Accordion,
} as ComponentMeta<typeof Accordion>

const AccordionTemplate: ComponentStory<typeof Accordion> = (args) => (
  <ThemeProvider>
    <Accordion {...args}>
      <AccordionSummary expandedIcon={<ExpandMoreIcon />}>
        Accordion 1
      </AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </AccordionDetails>
    </Accordion>
    <Accordion {...args}>
      <AccordionSummary expandedIcon={<ExpandMoreIcon />}>
        Accordion 2
      </AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </AccordionDetails>
    </Accordion>
    <Accordion {...args}>
      <AccordionSummary expandedIcon={<ExpandMoreIcon />}>
        Accordion 3
      </AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </AccordionDetails>
    </Accordion>
  </ThemeProvider>
)

export const Primary = AccordionTemplate.bind({})

Primary.args = {
  expanded: false,
  id: 'accordion-1',
}
