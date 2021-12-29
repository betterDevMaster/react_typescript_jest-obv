import styled from 'styled-components'
import React, {useState} from 'react'
import Layout from 'organization/user/Layout'
import {FAQ} from 'Event/FaqPage'
import Page from 'organization/Event/Page'
import AddFaqButton from 'Event/template/NiftyFifty/Dashboard/Faqs/FaqPageConfig/AddFaqButton'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import PageSettingsDialog from 'Event/template/NiftyFifty/Dashboard/Faqs/FaqPageConfig/PageSettingsDialog'
import {useTemplate} from 'Event/TemplateProvider'
import NiftyFiftyFaqPage from 'Event/template/NiftyFifty/Dashboard/Faqs'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'
import {useFaqs} from 'organization/Event/FaqsProvider'

export default function FaqPageConfig() {
  const {add, loading, edit} = useFaqs()
  const [pageSettingsVisible, setPageSettingsVisible] = useState(false)

  const handleAddedFaq = (newFaq: FAQ) => {
    add(newFaq)
    edit(newFaq)
  }

  const togglePageSettings = () => setPageSettingsVisible(!pageSettingsVisible)

  if (loading) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  return (
    <Layout>
      <Page>
        <PageSettingsDialog
          visible={pageSettingsVisible}
          onClose={togglePageSettings}
        />
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={togglePageSettings}
            aria-label="configure Faq page"
          >
            Page Settings
          </Button>
        </Box>
        <StyledAddFaqButton onAdd={handleAddedFaq} />
        <FaqPage />
      </Page>
    </Layout>
  )
}

function FaqPage() {
  const template = useTemplate()
  const {faqs} = useFaqs()

  switch (template.name) {
    case NIFTY_FIFTY:
      return <NiftyFiftyFaqPage isEditMode faqs={faqs} />
    default:
      throw new Error(`Missing Faq page for template: ${template.name}`)
  }
}

const StyledAddFaqButton = styled(AddFaqButton)`
  margin-bottom: ${(props) => props.theme.spacing[8]}!important;
`
