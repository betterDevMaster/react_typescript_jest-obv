import React from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Menu from 'lib/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import {localTime} from 'lib/date-time'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {Recording} from 'organization/Event/Room/Recordings'

export default function MeetingCard(props: {
  recordings: Recording[]
  part: number
  hasMultipleParts: boolean
}) {
  const {recordings, part, hasMultipleParts} = props

  const hasRecordings = recordings.length > 0
  if (!hasRecordings) {
    return (
      <Card>
        <CardContent>No Recordings Available</CardContent>
      </Card>
    )
  }

  const [main, ...others] = recordings

  return (
    <Card elevation={4}>
      <StyledReactPlayer playing controls light url={main.download_url} />
      <CardContent>
        <PartLabel showing={hasMultipleParts}>
          <div>
            Part: <b>{part}</b>
          </div>
        </PartLabel>
        <div>
          Start time: <b>{localTime(main.recording_start)}</b>
        </div>
        <div>
          End time: <b>{localTime(main.recording_end)}</b>
        </div>
        <div>
          File size: <b>{convertFileSizeToReadable(main.file_size)}</b>
        </div>
      </CardContent>
      <CardActions>
        <Menu
          button={({open}) => (
            <ButtonGroup variant="contained" color="primary">
              <Button
                color="primary"
                variant="contained"
                aria-label={`download ${main.name}`}
                href={main.download_url}
                download
              >
                Download
              </Button>
              <Button
                color="primary"
                size="small"
                aria-label="view other recordings"
                aria-haspopup="menu"
                onClick={open}
              >
                <ArrowDownIcon />
              </Button>
            </ButtonGroup>
          )}
        >
          {others.map((recording) => (
            <AbsoluteLink
              key={recording.download_url}
              to={recording.download_url}
              aria-label={`download ${recording.name}`}
              download
              disableStyles
            >
              <MenuItem>
                {recording.name} - {recording.file_type} -{' '}
                <b>{convertFileSizeToReadable(recording.file_size)}</b>
              </MenuItem>
            </AbsoluteLink>
          ))}
        </Menu>
      </CardActions>
    </Card>
  )
}

function PartLabel(props: {showing: boolean; children: React.ReactElement}) {
  if (!props.showing) {
    return null
  }

  return props.children
}

export function convertFileSizeToReadable(size: number) {
  let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  )
}

const StyledReactPlayer = styled(ReactPlayer)`
  width: 100% !important;
  background-color: #000000;
`
