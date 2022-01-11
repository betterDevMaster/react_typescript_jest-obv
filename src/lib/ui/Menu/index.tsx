import React from 'react'
import Menu from '@material-ui/core/Menu'
import {PopoverOrigin} from '@material-ui/core'

export type MenuProps = {
  className?: string
  anchorEl: HTMLElement | null
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
  open: boolean
  onClose: () => void
  children: React.ReactNode | React.ReactNode[] | string
}

export default function ItemMenu(props: MenuProps) {
  const {
    className,
    anchorEl,
    anchorOrigin,
    transformOrigin,
    open,
    onClose,
  } = props
  return (
    <Menu
      className={className}
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      MenuListProps={{
        disablePadding: true,
      }}
      keepMounted
      transformOrigin={transformOrigin}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          minWidth: 150,
        },
      }}
    >
      {props.children}
    </Menu>
  )
}
