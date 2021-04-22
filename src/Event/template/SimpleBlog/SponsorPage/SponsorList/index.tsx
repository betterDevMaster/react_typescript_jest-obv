import {Sponsor} from 'Event/SponsorPage'
import Card from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card'
import React from 'react'

export default function SponsorList(props: {
  className?: string
  sponsors: Sponsor[]
  isEditMode?: boolean
}) {
  const isEmpty = props.sponsors.length === 0
  if (isEmpty) {
    return <div>No sponsors have been added</div>
  }

  return (
    <div className={props.className}>
      {props.sponsors.map((sponsor) => (
        <Card
          key={sponsor.id}
          sponsor={sponsor}
          isEditMode={props.isEditMode}
        />
      ))}
    </div>
  )
}
