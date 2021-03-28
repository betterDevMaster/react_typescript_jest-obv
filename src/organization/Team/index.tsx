import Page from 'organization/user/Layout/Page'
import React, {useState} from 'react'
import TeamMembersTable from 'organization/Team/TeamMembersTable'
import AddTeamMemberForm from 'organization/Team/AddTeamMemberForm'
import TeamProvider from 'organization/Team/TeamProvider'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Roles from 'organization/Team/Roles'
import RolesProvider from 'organization/Team/Roles/RolesProvider'
import Layout from 'organization/user/Layout'
import TabPanel from 'lib/ui/tabs/TabPanel'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import HasPermission from 'organization/HasPermission'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'

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
          <RolesProvider>
            <Tabs onChange={changeTab} value={tabIndex}>
              <Tab label="Members" />
              <Tab label="Roles" />
            </Tabs>
            <TabPanel index={0} currentIndex={tabIndex}>
              <HasPermission permission={UPDATE_TEAM}>
                <AddTeamMemberForm />
              </HasPermission>
              <TeamMembersTable />
            </TabPanel>
            <TabPanel index={1} currentIndex={tabIndex}>
              <Roles />
            </TabPanel>
          </RolesProvider>
        </TeamProvider>
      </Page>
    </Layout>
  )
}
