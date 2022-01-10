import React from 'react'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import {makeStyles} from '@material-ui/core/styles'

type AccordionSummaryProps = {
  children: JSX.Element | string | JSX.Element[]
  expandedIcon?: JSX.Element
  ['aria-label']?: string
}

export default function AccordionSummary(props: AccordionSummaryProps) {
  const useStyles = makeStyles({
    root: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
      },
    },
  })

  const classes = useStyles()
  return (
    <MuiAccordionSummary
      className={classes.root}
      expandIcon={props.expandedIcon}
      aria-label={props['aria-label']}
    >
      {props.children}
    </MuiAccordionSummary>
  )
}
