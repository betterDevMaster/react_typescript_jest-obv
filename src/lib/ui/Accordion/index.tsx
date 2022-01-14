import React, {useState} from 'react'
import MuiAccordion from '@material-ui/core/Accordion'
import {makeStyles} from '@material-ui/styles'

export type AccordionProps = {
  children: JSX.Element | JSX.Element[]
  expandIcon?: JSX.Element
  disabled?: boolean
  expanded: boolean
  isSquare?: boolean
  id: string
  onChange?: (panel: string) => {}
}

export default function Accordion(props: AccordionProps) {
  const [expanded, setExpanded] = useState(props.expanded)

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean,
  ) => {
    setExpanded(newExpanded)
    if (props.onChange) {
      props.onChange(panel)
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
      expanded={expanded}
      disabled={props.disabled}
      onChange={handleChange(props.id)}
    >
      {props.children}
    </MuiAccordion>
  )
}
