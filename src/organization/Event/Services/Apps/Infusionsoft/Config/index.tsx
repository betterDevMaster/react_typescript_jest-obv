import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import Page from 'organization/Event/Page'
import {
  ATTENDEE_CHECKED_IN,
  ATTENDEE_CREATED,
  ATTENDEE_SIGNED_WAIVER,
  IMPORT_TAG,
  InfusionsoftGroup,
  InfusionsoftIntegration,
  Tag,
} from 'organization/Event/Services/Apps/Infusionsoft'
import LoginFieldInput from 'organization/Event/Services/Apps/Infusionsoft/Config/LoginFieldInput'
import TagIdInput from 'organization/Event/Services/Apps/Infusionsoft/Config/TagIdInput'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useEffect, useState} from 'react'
import GroupsConfig from 'organization/Event/Services/Apps/Infusionsoft/Config/GroupsConfig'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import {Grid} from '@material-ui/core'
import ImportAttendeesButton from 'organization/Event/Services/Apps/Infusionsoft/Config/ImportAttendeesButton'
import {
  useInfusionsoft,
  useServices,
} from 'organization/Event/Services/ServicesProvider'
import {Field} from 'organization/Event/Services/Apps/Infusionsoft/Config/FieldAutocomplete'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import InfoAlert from 'lib/ui/alerts/InfoAlert'
import {useToggle} from 'lib/toggle'

export interface TagsAndFieldsData {
  tags: Tag[]
  groups: InfusionsoftGroup[]
  login_field: {
    label: string
    name: string
  }
}

export default function Config() {
  const infusionsoft = useInfusionsoft()
  const {save, processing, error} = useSave()

  const [groups, setGroups] = useState<InfusionsoftGroup[]>(infusionsoft.groups)
  const [tags, setTags] = useState<Tag[]>(infusionsoft.tags)
  const [loginField, setLoginField] = useState<Field | null>(null)

  const [importError, setImportError] = useState('')
  const clearImportError = () => setImportError('')
  const {flag: showingImportSuccess, toggle: toggleImportSuccess} = useToggle()
  useEffect(() => {
    setGroups(infusionsoft.groups)
    setTags(infusionsoft.tags)

    if (infusionsoft.login_field_name && infusionsoft.login_field_label) {
      setLoginField({
        name: infusionsoft.login_field_name,
        label: infusionsoft.login_field_label,
      })
    } else {
      setLoginField(null)
    }
  }, [infusionsoft])

  const updateTag = (tag: Tag) => {
    const updated = tags.map((t) => {
      const isTarget = t.id === tag.id

      if (isTarget) {
        return tag
      }

      return t
    })

    setTags(updated)
  }

  const handleSave = () => {
    const data: TagsAndFieldsData = {
      tags,
      groups,
      login_field: {
        name: loginField?.name || '',
        label: loginField?.label || '',
      },
    }

    save(data)
  }

  const tagForType = (type: Tag['type']) => {
    const target = tags.find((t) => t.type === type)
    if (!target) {
      throw new Error(`Unknown tag type: ${type}`)
    }

    return target
  }

  return (
    <Layout>
      <Page>
        <div>
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h4">Keap</Typography>
              </Grid>
              <StyledGrid item md={6}>
                <ImportAttendeesButton
                  onSuccess={toggleImportSuccess}
                  onError={setImportError}
                />
              </StyledGrid>
            </Grid>
          </Box>
          <ErrorAlert onClose={clearImportError}>{importError}</ErrorAlert>
          <InfoAlert showing={showingImportSuccess}>
            Import successfully started. Depending on the number of contacts,
            this process may take up to 20 minutes.
          </InfoAlert>
          <Box mb={3}>
            <LoginFieldInput value={loginField} onChange={setLoginField} />
          </Box>
          <Box mb={3}>
            <Typography variant="h5">
              Attendee Import or Delete via API requests
            </Typography>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h6">Attendee Import</Typography>
                <em> {api('/infusionsoft/attendees/import')} (POST)</em>

                <pre>{`
{
  "first_name": string,
  "last_name": string,
  "email": string,
  "access_token": obv.io access token,
  "tags": "tag1, tag2, tag3",
  "MyGroup": "VIP",
  "Another Group": "Any string value here"
}
                  `}</pre>
                <em>
                  If an attendee with the given email already exists, obv.io
                  will update the other attributes.
                </em>
              </Grid>
              <Grid item md={6}>
                <Typography variant="h6">Attendee Delete</Typography>
                <em> {api('/infusionsoft/attendees/delete')} (POST)</em>
                <pre>{`
{
  "email": string,
  "access_token": obv.io access token
}
                        `}</pre>
              </Grid>
            </Grid>
          </Box>
          <Box mb={3}>
            <Box mb={2}>
              <Typography variant="h5">
                Attendee Import or Delete via Tag
              </Typography>
            </Box>
            <TagIdInput tag={tagForType(IMPORT_TAG)} onChange={updateTag} />
            <em>
              If an attendee with the given email already exists, obv.io will
              update the other attributes.
            </em>
          </Box>

          <Box mb={3}>
            <Typography variant="h5">Tags</Typography>
          </Box>

          <TagIdInput tag={tagForType(ATTENDEE_CREATED)} onChange={updateTag} />
          <TagIdInput
            tag={tagForType(ATTENDEE_CHECKED_IN)}
            onChange={updateTag}
          />
          <TagIdInput
            tag={tagForType(ATTENDEE_SIGNED_WAIVER)}
            onChange={updateTag}
          />

          <Box mb={3}>
            <Typography variant="h5">Groups</Typography>
          </Box>
          <Box mb={5}>
            <GroupsConfig onChange={setGroups} groups={groups} />
          </Box>
        </div>
        <ErrorAlert>{error}</ErrorAlert>
        <SaveButton
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          aria-label="save"
          onClick={handleSave}
          disabled={processing}
        >
          Save
        </SaveButton>
      </Page>
    </Layout>
  )
}

function useSave() {
  const {client} = useOrganization()
  const {event} = useEvent()

  const [processing, setProcessing] = useState<boolean>(false)
  const {update: updateIntegration} = useServices()
  const [error, setError] = useState<string | null>(null)

  const save = (data: TagsAndFieldsData) => {
    setProcessing(true)
    client
      .put<InfusionsoftIntegration>(
        api(`/events/${event.slug}/integrations/infusionsoft`),
        data,
      )
      .then(updateIntegration)
      .catch((e) => setError(e.message))
      .finally(() => {
        setProcessing(false)
      })
  }

  return {
    processing,
    error,
    save,
  }
}

const StyledGrid = withStyles({
  root: {
    display: 'flex',
    justifyContent: 'end',
  },
})(Grid)

const SaveButton = withStyles({
  root: {
    marginBottom: spacing[5],
  },
})(Button)
