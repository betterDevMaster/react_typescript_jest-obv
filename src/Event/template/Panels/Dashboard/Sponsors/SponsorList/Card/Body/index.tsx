import React from 'react'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import Typography from '@material-ui/core/Typography'
import Clickable from 'lib/ui/Clickable'
import {useSponsors} from 'organization/Event/SponsorsProvider'
import {useVariables} from 'Event'
import TextContent from 'lib/ui/form/TextEditor/Content'

export const SPONSOR_QUESTION_ICON_PLACEHOLDER = 'http://placehold.jp/50x50.png'

type BodyProps = {
  sponsor: Sponsor
  isEditMode?: boolean
  toggleForm: () => void
}

export default function Body(props: BodyProps) {
  if (props.isEditMode) {
    return <Editable {...props} />
  }

  return <Content {...props} />
}

function Editable(props: BodyProps) {
  const {edit} = useSponsors()

  return (
    <>
      <Clickable onClick={() => edit(props.sponsor)}>
        <Content {...props} />
      </Clickable>
    </>
  )
}

function Content(props: BodyProps) {
  const {sponsor} = props
  const v = useVariables()

  return (
    <Box>
      <SponsorHeader>
        <Typography variant="h5">{sponsor.name}</Typography>
      </SponsorHeader>
      <TextContent>{v(sponsor.description)}</TextContent>
    </Box>
  )
}

const Box = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const SponsorHeader = styled.div`
  display: flex;
  justify-content: space-between;
`
