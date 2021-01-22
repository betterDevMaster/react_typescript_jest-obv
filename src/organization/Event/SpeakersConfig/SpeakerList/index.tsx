import {Speaker} from 'Event'
import Card from 'organization/Event/SpeakersConfig/SpeakerList/Card'
import React from 'react'

export default function SpeakerList(props: {
  className?: string
  speakers: Speaker[]
  onSelect: (speaker: Speaker) => void
}) {
  const isEmpty = props.speakers.length === 0
  if (isEmpty) {
    return <div>No speakers have been added</div>
  }

  const select = (speaker: Speaker) => () => props.onSelect(speaker)

  return (
    <div className={props.className}>
      {props.speakers.map((speaker) => (
        <Card key={speaker.id} speaker={speaker} onClick={select(speaker)} />
      ))}
    </div>
  )
}
