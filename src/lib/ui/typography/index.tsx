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
`

const Description = styled(Typography)<Props>`
  font-weight: 300 !important;
  font-size: 14px !important;
  line-height: 17px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : '#939393')};
`

const SubHead = styled(Typography)<Props>`
  font-weight: 500 !important;
  font-size: 18px !important;
  line-height: 21px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : '#000000')};
`

const Label = styled(Typography)<Props>`
  font-weight: normal !important;
  font-size: 14px !important;
  line-height: 17px !important;
  color: ${(props) => (props.white ? '#FFFFFF' : '#000000')};
`

export {Title, Description, SubHead, Label}
