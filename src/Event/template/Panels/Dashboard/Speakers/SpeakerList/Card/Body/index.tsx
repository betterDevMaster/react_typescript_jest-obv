import React from 'react'
import {Speaker} from 'Event/SpeakerPage'
import {useVariables} from 'Event'
import Content from 'lib/ui/form/TextEditor/Content'

export default function Body(props: {speaker: Speaker}) {
  const {speaker} = props
  const v = useVariables()

  return (
    <div>
      <Content>{v(speaker.text)}</Content>
    </div>
  )
}
