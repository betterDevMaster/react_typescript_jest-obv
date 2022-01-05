import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Header from './Header'
import EventField from './EventField'
import Subheading from 'lib/ui/typography/Subheading'
import ImageUploader from 'lib/ui/ImageUploader'
import {FileLocation} from 'lib/http-client'

export type CreateEventProps = {
  eventImage: FileLocation
  imageWidth: number
  imageHeight: number
  imageProcessing: boolean
  imageAutoUpload: boolean
  iconImage: FileLocation
  iconWidth: number
  iconHeight: number
  iconProcessing: boolean
  iconAutoUpload: boolean
}

export default function CreateEvent(props: CreateEventProps) {
  const {
    eventImage,
    imageWidth,
    imageHeight,
    imageProcessing,
    imageAutoUpload,
    iconImage,
    iconWidth,
    iconHeight,
    iconProcessing,
    iconAutoUpload,
  } = props
  return (
    <Box>
      <Header />
      <EventField
        title="Event Name*"
        description="Short description what the event name is used for"
        placeholder="Type event name"
      />
      <EventField
        title="Unique Slug*"
        description="Your event slug will be a part of your domain"
        placeholder="/unique-slug"
      />
      <EventField
        title="Anticipated amount of attendees"
        description="Short description about amount of attendees"
        placeholder="Number of attendees"
      />
      <DateHeaderBox>
        <Subheading>Event date/time</Subheading>
      </DateHeaderBox>
      <EventField
        title="Start date/time"
        description="Enter start date/time of event"
        placeholder="April 1st 12:43pm"
      />
      <EventField
        title="End date/time"
        description="Enter End date/time of event"
        placeholder="April 2nd 12:43pm"
      />
      <ImageUploader
        label="Event Image"
        fileLocation={eventImage}
        width={imageWidth}
        height={imageHeight}
        processing={imageProcessing}
        autoUpload={imageAutoUpload}
        onChange={(file) => {}}
      />
      <ImageUploader
        label="Favicon"
        fileLocation={iconImage}
        width={iconWidth}
        height={iconHeight}
        processing={iconProcessing}
        autoUpload={iconAutoUpload}
        onChange={(file) => {}}
      />
    </Box>
  )
}

const DateHeaderBox = styled(Box)`
  margin-top: ${(props) => props.theme.spacing[10]};
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`
