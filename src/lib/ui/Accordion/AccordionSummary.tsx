import React, {useMemo} from 'react'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import {MenuIcon, PlusIcon, MinusIcon} from 'lib/ui/Icon'
import styled from 'styled-components'
import {colors, getColor} from 'lib/ui/theme'

type AccordionSummaryProps = {
  children: JSX.Element | string | JSX.Element[]
  expandedIconName?: 'menu' | 'chevron' | 'plus'
  expanded?: boolean
  activeColor?: keyof typeof colors
  ['aria-label']?: string
}

export default function AccordionSummary(props: AccordionSummaryProps) {
  const color = useMemo(() => {
    return props.expanded ? getColor(props.activeColor) : 'unset'
  }, [props.expanded, props.activeColor])

  return (
    <Summary
      expandIcon={<ExpandedIcon {...props} color={color} />}
      aria-label={props['aria-label']}
      expanded={props.expanded}
      color={color}
    >
      {props.children}
    </Summary>
  )
}

function ExpandedIcon(props: AccordionSummaryProps & {color: string}) {
  if (props.expandedIconName === 'menu') {
    return <MenuIcon color={props.color} />
  }
  if (props.expandedIconName === 'chevron') {
    return <ChevronIcon color={props.color} />
  }
  if (props.expandedIconName === 'plus' && !props.expanded) {
    return <PlusIcon color={props.color} />
  }
  if (props.expandedIconName === 'plus' && props.expanded) {
    return <MinusIcon color={props.color} />
  }

  return null
}

const Summary = styled((props) => {
  const {expanded, color, ...otherProps} = props
  return <MuiAccordionSummary {...otherProps} />
})`
  background-color: ${(props) => (!props.expanded ? '#ffffff' : '#F1F1F1')};
  color: ${(props) => props.color};
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  min-height: 56px !important;
`

const DownIcon = styled(KeyboardArrowDownIcon)`
  margin: 0 12px;
  color: #333333;
`
