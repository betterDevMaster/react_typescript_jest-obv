import React from 'react'
import styled from 'styled-components'
import Speaker, {SpeakerProps} from './Speaker'
import Grid from '@material-ui/core/Grid'

export type SpeakersListProps = {
  speakers: SpeakerProps[]
}

export default function SpeakersList(props: SpeakersListProps) {
  const {speakers} = props

  return (
    <Grid container>
      {speakers.map((speaker: SpeakerProps, index: number) => (
        <Content item xs={12} lg={7} key={index}>
          <Speaker {...speaker} />
        </Content>
      ))}
    </Grid>
  )
}

const Content = styled(Grid)`
  margin-bottom: 10px !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-bottom: 0 !important;
  }
`
