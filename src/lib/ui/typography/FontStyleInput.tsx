import React from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
import {withStyles} from '@material-ui/core'
import {colors} from 'lib/ui/theme'

export const BOLD = 'bold'
export const UNDERLINE = 'underline'
export const ITALIC = 'italic'

export type FontStyle = typeof BOLD | typeof UNDERLINE | typeof ITALIC

export default function FontStyleInput(props: {
  value: FontStyle[]
  onChange: (styles: FontStyle[]) => void
}) {
  const {value, onChange} = props
  const setStyles = (_: React.MouseEvent<HTMLElement>, styles: FontStyle[]) => {
    onChange(styles)
  }

  return (
    <ToggleButtonGroup
      value={value}
      onChange={setStyles}
      aria-label="text formatting"
    >
      <StyledToggleButton value={BOLD} aria-label={BOLD} disableRipple>
        <FormatBoldIcon />
      </StyledToggleButton>
      <StyledToggleButton value={ITALIC} aria-label={ITALIC} disableRipple>
        <FormatItalicIcon />
      </StyledToggleButton>
      <StyledToggleButton
        value={UNDERLINE}
        aria-label={UNDERLINE}
        disableRipple
      >
        <FormatUnderlinedIcon />
      </StyledToggleButton>
    </ToggleButtonGroup>
  )
}

const StyledToggleButton = withStyles({
  root: {
    border: 'none',
    padding: 0, // Smaller buttons
    backgroundColor: 'transparent!important', // Hides all 'boxes'

    '&:hover': {
      color: 'rgba(0, 0, 0, 0.54)', // Initial color when selected
    },
  },
  selected: {
    color: `${colors.primary}!important`,
  },
})(ToggleButton)
