import {User} from 'auth/user'
import Page from 'organization/user/Layout/Page'
import React, {useState} from 'react'
import TeamMemberList from 'organization/Team/TeamMemberList'
import AddTeamMemberForm from 'organization/Team/AddTeamMemberForm'
import IfOwner from 'organization/auth/IfOwner'
import TeamProvider from 'organization/Team/TeamProvider'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Permissions from 'organization/Team/Permissions'
import PermissionsProvider from 'organization/Team/Permissions/PermissionsProvider'
import Layout from 'organization/user/Layout'
import TabPanel from 'lib/ui/tabs/TabPanel'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {useOrganization} from 'organization/OrganizationProvider'

export type TeamMember = User & {
  permissions: string[]
}

export default function Team() {
  const [tabIndex, setTabIndex] = useState(0)
  const {routes} = useOrganization()

  useBreadcrumbs([
    {
      title: 'Team',
      url: routes.team,
    },
  ])

  const changeTab = (_: React.ChangeEvent<{}>, newTabIndex: number) => {
    setTabIndex(newTabIndex)
  }

  return (
    <Layout>
      <Page>
        <TeamProvider>
          <PermissionsProvider>
            <Tabs onChange={changeTab} value={tabIndex}>
              <Tab label="Members" />
              <Tab label="Permissions" />
            </Tabs>
            <TabPanel index={0} currentIndex={tabIndex}>
              <IfOwner>
                <AddTeamMemberForm />
              </IfOwner>
              <TeamMemberList />
            </TabPanel>
            <TabPanel index={1} currentIndex={tabIndex}>
              <Permissions />
            </TabPanel>
          </PermissionsProvider>
        </TeamProvider>
      </Page>
    </Layout>
  )
}
