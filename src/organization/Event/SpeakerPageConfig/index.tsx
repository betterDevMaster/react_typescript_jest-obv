import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import React, {useState} from 'react'
import Layout from 'organization/user/Layout'
import AddSpeakerButton from 'organization/Event/SpeakerPageConfig/AddSpeakerButton'
import Page from 'organization/Event/Page'
import SpeakerPageEditDialog from 'organization/Event/SpeakerPageConfig/SpeakerPageEditDialog'
import {Speaker} from 'Event/SpeakerPage'
import {useSpeakers} from 'organization/Event/SpeakersProvider'
import {useTemplate} from 'Event/TemplateProvider'
import {useTeamMember} from 'organization/auth'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSpeakerPage from 'Event/template/SimpleBlog/SpeakerPage'

export default function SpeakerPageConfig() {
  const {add, edit} = useSpeakers()

  const [pageSettingsVisible, setPageSettingsVisible] = useState(false)
  const togglePageSettings = () => setPageSettingsVisible(!pageSettingsVisible)

  const handleAddedSpeaker = (newSpeaker: Speaker) => {
    add(newSpeaker)
    edit(newSpeaker)
  }

  return (
    <>
      <SpeakerPageEditDialog
        onClose={togglePageSettings}
        visible={pageSettingsVisible}
      />
      <Layout>
        <Page>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={togglePageSettings}
            >
              Page Settings
            </Button>
          </Box>
          <StyledAddSpeakerButton onAdd={handleAddedSpeaker} />
          <SpeakerPage />
        </Page>
      </Layout>
    </>
  )
}

function SpeakerPage() {
  const template = useTemplate()

  const user = useTeamMember()
  const {speakers} = useSpeakers()

  switch (template.name) {
    case SIMPLE_BLOG:
      return (
        <SimpleBlogSpeakerPage user={user} isEditMode speakers={speakers} />
      )
    default:
      throw new Error(`Missing sponsor page for template: ${template.name}`)
  }
}

const StyledAddSpeakerButton = styled(AddSpeakerButton)`
  margin-bottom: ${(props) => props.theme.spacing[8]}!important;
`
