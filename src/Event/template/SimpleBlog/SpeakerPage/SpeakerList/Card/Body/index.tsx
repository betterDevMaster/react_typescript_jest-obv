import React from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import {Speaker} from 'Event/SpeakerPage'
import {useVariables} from 'Event'

export default function Body(props: {speaker: Speaker}) {
  const {speaker} = props
  const v = useVariables()

  return (
    <div>
      <Box>
        <Typography variant="h5">{v(speaker.name)}</Typography>
      </Box>
      <div
        dangerouslySetInnerHTML={{
          __html: v(speaker.text),
        }}
      />
    </div>
  )
}

const Box = styled.div`
  display: flex;
  justify-content: space-between;
`
