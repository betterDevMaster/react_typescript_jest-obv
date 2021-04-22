import React from 'react'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import SponsorList from 'Event/template/SimpleBlog/SponsorPage/SponsorList'
import {User} from 'auth/user'
import {useEvent} from 'Event/EventProvider'
import SponsorEditDialog from 'Event/template/SimpleBlog/SponsorPage/SponsorEditDialog'

export default function SimpleBlogSponsorPage(props: {
  user: User
  isEditMode?: boolean
  sponsors: Sponsor[]
}) {
  const {sponsors} = props
  const {event} = useEvent()

  const content = (
    <>
      <Title aria-label="sponsors title">{event.sponsor_page_title}</Title>
      <SponsorEditDialog isEditMode={props.isEditMode} />
      <SponsorList sponsors={sponsors} isEditMode={props.isEditMode} />
    </>
  )

  if (props.isEditMode) {
    return content
  }

  return <Page user={props.user}>{content}</Page>
}

const Title = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
