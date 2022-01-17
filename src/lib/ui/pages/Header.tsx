import React from 'react'
import styled from 'styled-components'

import {Title, Description} from 'lib/ui/typography'
import Grid from 'lib/ui/Grid'

export type HeaderProps = {
  title: string
  description?: string
  leftActions?: JSX.Element | JSX.Element[]
}
export default function Header(props: HeaderProps) {
  const {title, description, leftActions} = props
  return (
    <Container container justify="space-between">
      <Grid item sm={6} md={3}>
        <Title>{title}</Title>
        <Description>{description || ''}</Description>
      </Grid>
      <StyledGrid item sm={2} md={2}>
        {leftActions}
      </StyledGrid>
    </Container>
  )
}

const Container = styled(Grid)`
  margin-bottom: ${(props) => props.theme.spacing[16]};
`
const StyledGrid = styled(Grid)`
  text-align: right;
`
