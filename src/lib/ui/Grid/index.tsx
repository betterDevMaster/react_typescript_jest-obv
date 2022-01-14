import React from 'react'
import MuiGrid, {GridProps as MuiGridProps} from '@material-ui/core/Grid'

type GridProps = MuiGridProps & {}

export default function Grid(props: GridProps) {
  return <MuiGrid {...props} />
}
