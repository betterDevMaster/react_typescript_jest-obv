import React, {useState} from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import TabPanel from 'lib/ui/tabs/TabPanel'
import Page from 'organization/Event/Page'
import Information from 'organization/Event/Webhooks/Information'
import EventWebhookForm from 'organization/Event/Webhooks/EventWebhookForm'
import WebhookForm from 'organization/Event/Webhooks/WebhookForm'
import WebhookList from 'organization/Event/Webhooks/WebhookList'
import Layout from 'organization/user/Layout'

export default function Webhooks() {
  const [tab, setTab] = useState<number>(0)

  const handleChange = (_: React.ChangeEvent<{}>, tab: number) => {
    setTab(tab)
  }

  return (
    <Layout>
      <Page>
        <WebhookTabs>
          <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="service config tabs"
          >
            <Tab label="Webhooks" />
            <Tab label="Information" />
          </Tabs>

          <TabPanel currentIndex={tab} index={0} render>
            <Box mb={8}>
              <EventWebhookForm />
            </Box>

            <Box mb={8}>
              <Typography variant="h6">Add New Webhook</Typography>
              <WebhookForm />
            </Box>

            <Box mb={2}>
              <Typography variant="h6">Existing Webhooks</Typography>
              <WebhookList />
            </Box>
          </TabPanel>

          <TabPanel currentIndex={tab} index={1} render>
            <Information />
          </TabPanel>
        </WebhookTabs>
      </Page>
    </Layout>
  )
}

const WebhookTabs = styled.div`
  flex-grow: 1;
  width: '100%';
`
