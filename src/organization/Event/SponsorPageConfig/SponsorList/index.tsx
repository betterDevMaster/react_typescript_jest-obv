import {Sponsor} from 'Event'
import Card from 'organization/Event/SponsorPageConfig/SponsorList/Card'
import React from 'react'

export default function SponsorList(props: {
  className?: string
  sponsors: Sponsor[]
  onEditField: (sponsor: Sponsor) => void
  onEditImage: (sponsor: Sponsor) => void
  onUpdate: (sponsor: Sponsor) => void
}) {
  const isEmpty = props.sponsors.length === 0
  if (isEmpty) {
    return <div>No sponsors have been added</div>
  }

  const editField = (sponsor: Sponsor) => () => props.onEditField(sponsor)
  const editImage = (sponsor: Sponsor) => () => props.onEditImage(sponsor)

  return (
    <div className={props.className}>
      {props.sponsors.map((sponsor) => (
        <Card
          key={sponsor.id}
          sponsor={sponsor}
          onClickField={editField(sponsor)}
          onClickImage={editImage(sponsor)}
        />
      ))}
    </div>
  )
}
