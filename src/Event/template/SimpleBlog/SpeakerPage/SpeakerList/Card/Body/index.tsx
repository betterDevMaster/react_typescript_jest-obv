import React from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import {Speaker} from 'Event/SpeakerPage'

export default function Body(props: {speaker: Speaker}) {
  const {speaker} = props

  return (
    <div>
      <Box>
        <Typography variant="h5">{speaker.name}</Typography>
      </Box>
      <div
        dangerouslySetInnerHTML={{
          __html: speaker.text,
        }}
      />
    </div>
  )
}

const Box = styled.div`
  display: flex;
  justify-content: space-between;
`
