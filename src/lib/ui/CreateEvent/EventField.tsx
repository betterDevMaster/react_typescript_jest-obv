import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {SubHead, Description} from 'lib/ui/typography'
import TextField from 'lib/ui/TextField'

export type EventFieldProps = {
  title: string
  description: string
  placeholder: string
}

export default function EventField(props: EventFieldProps) {
  const {title, description, placeholder} = props
  return (
    <Box>
      <MDContainer>
        <StyledTextField variant="outlined" placeholder={title} fullWidth />
        <DescriptionBox>
          <Description>{description}</Description>
        </DescriptionBox>
      </MDContainer>
      <SMContainer>
        <FieldTitle>{title}</FieldTitle>
        <FieldDescription>{description}</FieldDescription>
        <TextField variant="outlined" placeholder={placeholder} fullWidth />
      </SMContainer>
    </Box>
  )
}

const StyledTextField = styled(TextField)`
  max-width: 640px;
`

const MDContainer = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing[5]};
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`

const DescriptionBox = styled(Box)`
  padding: ${(props) => `${props.theme.spacing[1]} ${props.theme.spacing[7]}`};
  border-left: 1px solid #3490dc;
  margin-left: ${(props) => props.theme.spacing[27]};
`

const SMContainer = styled(Box)`
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: block;
    margin-bottom: ${(props) => props.theme.spacing[10]};
  }
`

const FieldTitle = styled(SubHead)`
  margin-bottom: ${(props) => props.theme.spacing[4]} !important;
`

const FieldDescription = styled(Description)`
  margin-bottom: ${(props) => props.theme.spacing[4]} !important;
`
