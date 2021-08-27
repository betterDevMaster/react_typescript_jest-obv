import React from 'react'
import MuiMenu, {MenuProps} from '@material-ui/core/Menu'

/**
 * Wrapper around Material UI's dropdown Menu that provides consistent
 * defaults used in the app.
  
 * @param props 
 * @returns 
 */
export default function Menu(
  props: Omit<MenuProps, 'open'> & {
    disabled?: boolean
    button: (props: {
      open: (event: React.MouseEvent<HTMLElement>) => void
    }) => React.ReactElement
  },
) {
  const {button, ...menuProps} = props

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <>
      {props.button({open})}
      <MuiMenu
        onClick={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          disablePadding: true,
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        {...menuProps}
      />
    </>
  )
}
