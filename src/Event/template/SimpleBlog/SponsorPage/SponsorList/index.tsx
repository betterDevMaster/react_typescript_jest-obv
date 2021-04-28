import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import Card from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import {useTemplate} from 'Event/TemplateProvider'

export default function SponsorList(props: {
  className?: string
  sponsors: Sponsor[]
  isEditMode?: boolean
}) {
  const template = useTemplate()
  const {sponsors: sponsorPageSettings} = template

  const isEmpty = props.sponsors.length === 0
  if (isEmpty) {
    return <Typography align="center">No sponsors have been added</Typography>
  }

  return (
    <Box className={props.className}>
      {props.sponsors.map((sponsor) => (
        <StyledCard
          key={sponsor.id}
          sponsor={sponsor}
          isEditMode={props.isEditMode}
          border={sponsorPageSettings?.sponsorSeparator}
        />
      ))}
    </Box>
  )
}

const Box = styled.div`
  width: 100%;
`

/**
 * Fixes fowarding props (isEditMode) with undefined causing
 * app to crash
 */
const StyledCard = styled((props) => <Card {...props} />)`
  &:not(:last-child) {
    padding-bottom: ${(props) => props.theme.spacing[2]};
    margin-bottom: ${(props) => props.theme.spacing[8]};
    border-bottom: ${(props) => (props.border ? '1px' : '0')} solid ${grey[300]};
  }
`
