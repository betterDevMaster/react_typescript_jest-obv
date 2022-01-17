import styled from 'styled-components'
import Typography, {TypographyProps} from '@material-ui/core/Typography'

export type Props = TypographyProps & {
  white?: boolean
}

const Title = styled(Typography)<Props>`
  font-weight: bold !important;
  font-size: 36px !important;
  line-height: 43px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : '#000000')};
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 30px !important;
    line-height: 36px !important;
  }
`

const Description = styled(Typography)<Props>`
  font-weight: 300 !important;
  font-size: 14px !important;
  line-height: 17px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : '#939393')};
`

const Header = styled(Typography)<Props>`
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 24px !important;
  line-height: 28px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : '#000000')};
`

const SubHead = styled(Typography)<Props>`
  font-weight: 500 !important;
  font-size: 18px !important;
  line-height: 21px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : '#000000')};
`

const Label = styled(Typography)<Props>`
  font-style: normal !important;
  font-weight: normal !important;
  font-size: 14px !important;
  line-height: 17px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : '#000000')};
`

const Tiny = styled(Typography)<Props>`
  font-weight: 300 !important;
  font-size: 12px !important;
  line-height: 14px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : props.theme.colors.blue)};
`

const Text = styled(Typography)<Props>`
  font-style: normal !important;
  font-weight: normal !important;
  font-size: 12px !important;
  line-height: 14px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : '#000000')};
`

export {Title, Description, Header, SubHead, Label, Text, Tiny}
