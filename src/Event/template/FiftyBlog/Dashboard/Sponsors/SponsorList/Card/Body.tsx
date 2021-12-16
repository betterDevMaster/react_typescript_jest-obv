import React from 'react'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import {useAttendeeVariables} from 'Event'
import TextContent from 'lib/ui/form/TextEditor/Content'

export const SPONSOR_QUESTION_ICON_PLACEHOLDER = 'http://placehold.jp/50x50.png'

export default function Body(props: {sponsor: Sponsor}) {
  const {sponsor} = props
  const v = useAttendeeVariables()

  if (!sponsor.description) {
    return null
  }

  return (
    <Box>
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
  margin-top: 8px;

  /** 
   * Remove any bottom margin from the last element which
   * would mess up vertical centering.
  **/
  > div {
    > *:last-child {
      margin-bottom: 0;
    }
  }
`
