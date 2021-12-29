import styled from 'styled-components'
import React, {useEffect, useState} from 'react'
import Layout from 'organization/user/Layout'
import {Sponsor} from 'Event/SponsorPage'
import {OrganizationActionsProvider} from 'Event/ActionsProvider'
import Page from 'organization/Event/Page'
import AddSponsorButton from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorPageConfig/AddSponsorButton'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import PageSettingsDialog from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorPageConfig/PageSettingsDialog'
import NiftyFiftySponsorPage from 'Event/template/NiftyFifty/Dashboard/Sponsors'
import {useSponsors} from 'organization/Event/SponsorsProvider'
import {useSetIsEditMode} from 'Event/Dashboard/editor/views/ConfigBar'

export default function SponsorPageConfig() {
  const {loading} = useSponsors()

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
      <Layout>
        <Page>
          <SponsorsPageConfigContent />
        </Page>
      </Layout>
    </OrganizationActionsProvider>
  )
}

function SponsorsPageConfigContent() {
  const {add, edit, sponsors} = useSponsors()

  const setIsEditMode = useSetIsEditMode()
  useEffect(() => {
    setIsEditMode(true)
  }, [setIsEditMode])

  const handleAddedSponsor = (newSponsor: Sponsor) => {
    add(newSponsor)
    edit(newSponsor)
  }
  const [pageSettingsVisible, setPageSettingsVisible] = useState(false)
  const togglePageSettings = () => setPageSettingsVisible(!pageSettingsVisible)

  return (
    <>
      <PageSettingsDialog
        visible={pageSettingsVisible}
        onClose={togglePageSettings}
      />
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
      <NiftyFiftySponsorPage isEditMode sponsors={sponsors} />
    </>
  )
}

const StyledAddSponsorButton = styled(AddSponsorButton)`
  margin-bottom: ${(props) => props.theme.spacing[8]}!important;
`
