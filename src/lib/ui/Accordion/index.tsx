import React from 'react'
import MuiAccordion from '@material-ui/core/Accordion'
import {makeStyles} from '@material-ui/styles'

export type AccordionProps = {
  children: JSX.Element | JSX.Element[]
  disabled?: boolean
  expanded?: boolean
  isSquare?: boolean
  panelId?: string
  id: string
  onChange?: (panel?: string) => {}
}

export default function Accordion(props: AccordionProps) {
  const handleChange = (panelId?: string) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean,
  ) => {
    if (props.onChange) {
      props.onChange(panelId)
    }
  }

  const useStyles = makeStyles({
    root: {
      border: '1px solid #DFDFDF',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&.Mui-expanded': {
        margin: 'auto',
      },
    },
  })
  const classes = useStyles()
  return (
    <MuiAccordion
      className={classes.root}
      square={props.isSquare}
      expanded={props.expanded}
      disabled={props.disabled}
      onChange={handleChange(props.panelId)}
    >
      {props.children}
    </MuiAccordion>
  )
}
