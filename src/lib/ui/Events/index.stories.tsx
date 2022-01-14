import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import Events, {ViewType} from 'lib/ui/Events'

import Avatar1 from 'assets/images/ui/events/1.png'
import Avatar2 from 'assets/images/ui/events/2.png'
import Avatar3 from 'assets/images/ui/events/3.png'
import Avatar4 from 'assets/images/ui/events/4.png'
import Avatar5 from 'assets/images/ui/events/5.png'
import Avatar6 from 'assets/images/ui/events/6.png'
import Avatar7 from 'assets/images/ui/events/7.png'
import Avatar8 from 'assets/images/ui/events/8.png'

export default {
  title: 'Components/Events',
  component: Events,
  argTypes: {
    viewType: {
      options: [0, 1],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof Events>

const Template: ComponentStory<typeof Events> = (args) => (
  <ThemeProvider>
    <Events {...args} />
  </ThemeProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  viewType: ViewType.LIST,
  events: [
    {
      name: 'Obvio test event',
      url: 'Obvio-test-event.obv.io',
      avatar: Avatar1,
      live: true,
    },
    {
      name: 'VentureBeat',
      url: 'VentureBeat.obv.io',
      avatar: Avatar2,
      live: true,
    },
    {
      name: 'Asana',
      url: 'asana.obv.io',
      avatar: Avatar3,
      live: false,
    },
    {
      name: 'Zeplin',
      url: 'Zeplin.obv.io',
      avatar: Avatar4,
      live: false,
    },
    {
      name: 'miro test event',
      url: 'miro-test-event.obv.io',
      avatar: Avatar5,
      live: false,
    },
    {
      name: '500 startups',
      url: '500startups.obv.io',
      avatar: Avatar6,
      live: true,
    },
    {
      name: 'airbnb',
      url: 'airbnb.obv.io',
      avatar: Avatar7,
      live: false,
    },
    {
      name: 'batch',
      url: 'batch.obv.io',
      avatar: Avatar8,
      live: false,
    },
  ],
}
