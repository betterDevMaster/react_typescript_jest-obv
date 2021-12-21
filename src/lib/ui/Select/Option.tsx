import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'

type StyleProps = {
  dark?: boolean
}

const Option = styled(MenuItem)<StyleProps>`
  color: ${(props) => (props.dark ? '#FFFFFF' : '#000000')} !important;
  background-color: ${(props) =>
    props.dark ? '#353535' : '#FFFFFF'} !important;
`

export default Option
