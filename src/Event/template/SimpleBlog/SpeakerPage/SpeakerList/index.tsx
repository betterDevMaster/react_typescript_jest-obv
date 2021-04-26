import {Speaker} from 'Event/SpeakerPage'
import Card from 'Event/template/SimpleBlog/SpeakerPage/SpeakerList/Card'
import Grid, {GridSpacing} from '@material-ui/core/Grid'
import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {DEFAULT_SPEAKERS_SPACE} from 'organization/Event/SpeakerPageConfig/SpeakerPageEditDialog/Form'

export default function SpeakerList(props: {
  speakers: Speaker[]
  isEditMode?: boolean
}) {
  const template = useTemplate()

  const isEmpty = props.speakers.length === 0
  if (isEmpty) {
    return <div>No speakers have been added</div>
  }

  const spacing = (template.speakers?.speakersSpace ||
    DEFAULT_SPEAKERS_SPACE) as GridSpacing

  return (
    <Grid container spacing={spacing}>
      {props.speakers.map((speaker) => (
        <Grid item xs={12} key={speaker.id}>
          <Card speaker={speaker} isEditMode={props.isEditMode} />
        </Grid>
      ))}
    </Grid>
  )
}
