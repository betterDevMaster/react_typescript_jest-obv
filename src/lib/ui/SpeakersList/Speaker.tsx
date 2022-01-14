import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import IconButton from '@material-ui/core/IconButton'

export type SpeakerProps = {
  name: string
  image_url?: string
  description?: string
}

export default function Speaker(props: SpeakerProps) {
  return (
    <Container>
      <LgSpeaker {...props} />
      <SmSpeaker {...props} />
    </Container>
  )
}

const LgSpeaker = (props: SpeakerProps) => {
  const {name, image_url: imageUrl, description} = props

  return (
    <LgContent flexDirection="column">
      <Name>{name}</Name>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Photo src={imageUrl} variant="square" />
        <Description>{description}</Description>
        <StyledIconButton>
          <StyledIcon />
        </StyledIconButton>
      </Box>
    </LgContent>
  )
}

const SmSpeaker = (props: SpeakerProps) => {
  const {name, image_url: imageUrl, description} = props

  return (
    <SmContent flexDirection="column">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Photo src={imageUrl} variant="square" />
        <StyledIconButton>
          <StyledIcon />
        </StyledIconButton>
      </Box>
      <Name>{name}</Name>
      <Description>{description}</Description>
    </SmContent>
  )
}

const Container = styled(Box)`
  border: 1px solid #dfdfdf;
  padding: 19px 14px;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 20px 24px;
    border-color: transparent;
    border-bottom-color: #dfdfdf;
  }
`

const LgContent = styled(Box)`
  gap: 19px;
  display: flex;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`

const SmContent = styled(Box)`
  gap: 10px;
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: flex;
  }
`

const Name = styled(Typography)`
  font-weight: normal !important;
  font-size: 16px !important;
  line-height: 19px !important;
  color: #000000;
`

const Description = styled(Typography)`
  font-weight: 300 !important;
  font-size: 14px !important;
  line-height: 17px !important;
  color: #939393;
  margin-right: 73px !important;
  min-height: 80px;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-right: 0 !important;
    height: 100%;
  }
`

const Photo = styled(Avatar)`
  width: 80px !important;
  height: 80px !important;
  margin-right: 58px;
`

const StyledIconButton = styled(IconButton)`
  padding: 0 0 !important;
  height: 24px;
`

const StyledIcon = styled(MoreHorizIcon)`
  color: #000000 !important;
`
