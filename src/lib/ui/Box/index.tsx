import React from 'react'
import MuiBox, {BoxProps as MuiBoxProps} from '@material-ui/core/Box'
import styled from 'styled-components'

type BoxProps = MuiBoxProps & {
  fullWidth?: boolean
}

export default function Box(props: BoxProps) {
  const {fullWidth: _, ...otherProps} = props
  return <MuiBox {...otherProps} />
}

export const TopBottomBorderBox = styled(Box)`
  border-top: 1px solid #e7e7e7;
  border-bottom: 1px solid #e7e7e7;
  padding-top: ${(props) => props.theme.spacing[2]};
  padding-bottom: ${(props) => props.theme.spacing[2]};
  padding-left: ${(props) => props.theme.spacing[4]};
  padding-right: ${(props) => props.theme.spacing[4]};
`
