import styled from 'styled-components'
import React, {useState} from 'react'
import Layout from 'organization/user/Layout'
import {Sponsor} from 'Event/SponsorPage'
import {OrganizationActionsProvider} from 'Event/ActionsProvider'
import Page from 'organization/Event/Page'
import AddSponsorButton from 'Event/template/SimpleBlog/SponsorPage/SponsorPageConfig/AddSponsorButton'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import PageSettingsDialog from 'Event/template/SimpleBlog/SponsorPage/SponsorPageConfig/PageSettingsDialog'
import {useTeamMember} from 'organization/auth'
import {useTemplate} from 'Event/TemplateProvider'
import SimpleBlogSponsorPage from 'Event/template/SimpleBlog/SponsorPage'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {useSponsors} from 'organization/Event/SponsorsProvider'

export default function SponsorPageConfig() {
  const {add, loading, edit} = useSponsors()
  const [pageSettingsVisible, setPageSettingsVisible] = useState(false)

  const handleAddedSponsor = (newSponsor: Sponsor) => {
    add(newSponsor)
    edit(newSponsor)
  }

  const togglePageSettings = () => setPageSettingsVisible(!pageSettingsVisible)

  const loader = (
    <Layout>
      <Page>
        <div>loading...</div>
      </Page>
    </Layout>
  )

  if (loading) {
    return loader
  }

  return (
    <OrganizationActionsProvider loader={loader}>
      <>
        <PageSettingsDialog
          visible={pageSettingsVisible}
          onClose={togglePageSettings}
        />
        <Layout>
          <Page>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={togglePageSettings}
                aria-label="configure sponsor page"
              >
                Page Settings
              </Button>
            </Box>
            <StyledAddSponsorButton onAdd={handleAddedSponsor} />
            <SponsorPage />
          </Page>
        </Layout>
      </>
    </OrganizationActionsProvider>
  )
}

function SponsorPage() {
  const template = useTemplate()

  const user = useTeamMember()
  const {sponsors} = useSponsors()

  switch (template.name) {
    case SIMPLE_BLOG:
      return (
        <SimpleBlogSponsorPage user={user} isEditMode sponsors={sponsors} />
      )
    default:
      throw new Error(`Missing sponsor page for template: ${template.name}`)
  }
}

const StyledAddSponsorButton = styled(AddSponsorButton)`
  margin-bottom: ${(props) => props.theme.spacing[8]}!important;
`
