import React from 'react'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import {useAttendeeVariables} from 'Event'
import TextContent from 'lib/ui/form/TextEditor/Content'
import Grid from '@material-ui/core/Grid'

export const SPONSOR_QUESTION_ICON_PLACEHOLDER = 'http://placehold.jp/50x50.png'

export default function Body(props: {sponsor: Sponsor}) {
  const {sponsor} = props
  const v = useAttendeeVariables()

  if (!sponsor.description) {
    return null
  }

  return (
    <Grid item xs={12}>
      <Box>
        <TextContent>{v(sponsor.description)}</TextContent>
      </Box>
    </Grid>
  )
}

const Box = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
