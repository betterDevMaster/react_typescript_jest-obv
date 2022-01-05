import React from 'react'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import {makeStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'

type AccordionDetailsProps = {
  className?: string
  children: JSX.Element | string | JSX.Element[]
  expandedIcon?: JSX.Element
  ['aria-label']?: string
}

export default function AccordionDetails(props: AccordionDetailsProps) {
  const useStyles = makeStyles({
    root: {
      padding: spacing[2],
    },
  })

  const classes = useStyles()

  return (
    <MuiAccordionDetails
      classes={{root: classes.root}}
      className={props.className}
      aria-label={props['aria-label']}
    >
      {props.children}
    </MuiAccordionDetails>
  )
}
