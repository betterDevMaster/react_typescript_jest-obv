import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import React, {useState} from 'react'
import Layout from 'organization/user/Layout'
import AddSpeakerButton from 'Event/template/Cards/Speakers/SpeakerPageConfig/AddSpeakerButton'
import Page from 'organization/Event/Page'
import SpeakerPageEditDialog from 'Event/template/Cards/Speakers/SpeakerPageConfig/SpeakerPageEditDialog'
import {Speaker} from 'Event/SpeakerPage'
import {useSpeakers} from 'organization/Event/SpeakersProvider'
import SpeakerPage from 'Event/template/Cards/Speakers'
import {useObvioUser} from 'obvio/auth'

export default function SpeakerPageConfig() {
  const {add, edit} = useSpeakers()
  const [pageSettingsVisible, setPageSettingsVisible] = useState(false)
  const togglePageSettings = () => setPageSettingsVisible(!pageSettingsVisible)
  const {speakers} = useSpeakers()
  const user = useObvioUser()

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
          <SpeakerPage isEditMode speakers={speakers} user={user} />
        </Page>
      </Layout>
    </>
  )
}

const StyledAddSpeakerButton = styled(AddSpeakerButton)`
  margin-bottom: ${(props) => props.theme.spacing[8]}!important;
`
