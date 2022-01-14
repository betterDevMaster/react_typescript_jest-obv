import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import styled from 'styled-components'

type ProfileButtonAvatarProps = {
  size?: 'small' | 'large'
  url?: string
  alt?: string
}
export default function ProfileButtonAvatar(props: ProfileButtonAvatarProps) {
  return (
    <Container>
      <StyledAvatar alt={props.alt} src={props.url} size={props.size} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  > *: {
    margin: ${(props) => props.theme.spacing[1]};
  }
`

const StyledAvatar = styled(Avatar)<{size?: 'small' | 'large'}>`
  width: ${(props) =>
    props.size === 'small'
      ? props.theme.spacing[5]
      : props.size === 'large'
      ? props.theme.spacing[10]
      : props.theme.spacing[7]};
  height: ${(props) =>
    props.size === 'small'
      ? props.theme.spacing[5]
      : props.size === 'large'
      ? props.theme.spacing[10]
      : props.theme.spacing[7]};
`
