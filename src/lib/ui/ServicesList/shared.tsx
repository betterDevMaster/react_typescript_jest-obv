import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {Header, Label, Text} from 'lib/ui/typography'

const Container = styled(Box)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  padding: ${(props) => `${props.theme.spacing[7]} ${props.theme.spacing[6]}`};
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: ${(props) =>
      `${props.theme.spacing[6]} ${props.theme.spacing[5]}`};
  }
`

const StyledHeader = styled(Header)`
  margin-bottom: ${(props) => props.theme.spacing[4]} !important;
`

const ConnectLabel = styled(Label)`
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
`

const Paragraph = styled(Text)`
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
`

export {Container, StyledHeader, ConnectLabel, Paragraph}
