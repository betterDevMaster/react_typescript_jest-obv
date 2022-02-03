import React, {useEffect} from 'react'
import styled from 'styled-components'
import {useQueryParams} from 'lib/url'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AccessTokens, {
  ACCESS_TOKENS,
} from 'organization/Event/Services/AccessTokens'
import Apps, {APPS} from 'organization/Event/Services/Apps'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import TabPanel from 'lib/ui/tabs/TabPanel'

export default function Services() {
  const {activeTab} = useQueryParams()
  const [tab, setTab] = React.useState(0)

  // If we've got ?activeTab=accessTokens in the URI, we want to flip to the
  // access tokens tab, it's been targeted on purpose.
  useEffect(() => {
    if ((activeTab || '') === 'accessTokens') {
      setTab(1)
    }
  }, [activeTab])

  const handleChange = (_: React.ChangeEvent<{}>, tab: number) => {
    setTab(tab)
  }
  return (
    <Layout>
      <Page>
        <ServiceTab>
          <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="service config tabs"
          >
            <Tab label={APPS} />
            <Tab label={ACCESS_TOKENS} />
          </Tabs>
          <TabPanel currentIndex={tab} index={0} render>
            <Apps />
          </TabPanel>
          <TabPanel currentIndex={tab} index={1} render>
            <AccessTokens />
          </TabPanel>
        </ServiceTab>
      </Page>
    </Layout>
  )
}

const ServiceTab = styled.div`
  flex-grow: 1;
  width: '100%';
`
