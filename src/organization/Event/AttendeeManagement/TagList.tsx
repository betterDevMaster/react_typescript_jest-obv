import {Attendee} from 'Event/attendee'
import styled from 'styled-components'
import React from 'react'
import Chip from '@material-ui/core/Chip'
import {makeStyles} from '@material-ui/core/styles'

export default function TagList(props: {attendee: Attendee}) {
  const classes = useStyles()
  const hasTags = props.attendee.tags.length > 0
  if (!hasTags) {
    return null
  }

  return (
    <Box>
      {props.attendee.tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          color="primary"
          size="small"
          className={classes.chip}
        />
      ))}
    </Box>
  )
}

const spacing = 3

const Box = styled.div`
  margin: ${(props) => props.theme.spacing[1]} -${spacing}px;
`

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
}))
