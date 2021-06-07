import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
import SponsorList from 'Event/template/Panels/Dashboard/Sponsors/SponsorList'
import {User} from 'auth/user'
import SponsorEditDialog from 'Event/template/Panels/Dashboard/Sponsors/SponsorEditDialog'

export default function PanelsSponsorPage(props: {
  user: User
  isEditMode?: boolean
  sponsors: Sponsor[]
}) {
  const {sponsors} = props

  return (
    <>
      <SponsorEditDialog isEditMode={props.isEditMode} />
      <SponsorList sponsors={sponsors} isEditMode={props.isEditMode} />
    </>
  )
}
