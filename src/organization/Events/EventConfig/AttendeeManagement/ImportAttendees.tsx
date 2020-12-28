import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import Page from 'organization/user/Layout/Page'
import React, {useEffect, useRef, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'

export interface AttendeeImportData {
    data: Array<string>
    fileName: string
}

export default function ImportAttendees() {
    const {handleSubmit, setValue} = useForm()
    const [file, setFile] = useState<null | File>(null)
    const {client} = useOrganization()
    const {event} = useEvent()

    const Title = withStyles({
        root: {
            marginBottom: spacing[4],
        },
    })(Typography)

    const UploadButton = withStyles({
        root: {
            padding: 0,
        },
    })(Button)

    const UploadButtonLabel = styled.label`
      padding: 5px 15px;
      cursor: pointer;
    `
    const url = api(`/events/${event.slug}/attendees`)
    const submit = () => {
        const formData = new FormData()

        if (file) {
            formData.set('file', file)
        }

        return client.post<AttendeeImportData>(url, formData, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        }).then((data) => {
            var fileDownload = require('js-file-download');
            fileDownload(data.data, data.fileName);
        }).catch((e) => {

        })
    }

    const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const file = evt.target.files ? evt.target.files[0] : null
        setFile(file)
    }

    setValue('title', "Test")

    return (
        <Page>
            <Title variant="h5">Event Waiver</Title>
            <form onSubmit={handleSubmit(submit)}>
                <div>
                    <UploadButton variant="outlined" color="primary">
                        <UploadButtonLabel htmlFor="file-upload-holder">
                            Upload Image
                        </UploadButtonLabel>
                    </UploadButton>
                    <input
                        id="file-upload-holder"
                        type="file"
                        onChange={handleFileSelect}
                        hidden
                        required
                        aria-label="logo input"
                    />
                </div>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    aria-label="import attendees"
                >
                    Import attendees
                </Button>
            </form>
        </Page>
    )
}
