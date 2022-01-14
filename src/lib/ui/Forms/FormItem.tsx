import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {Label} from 'lib/ui/typography'
import Icon from 'lib/ui/Icon'
import IconButton from 'lib/ui/IconButton'
import {Form} from '.'
import Menu from 'lib/ui/Menu'
import MenuOption from 'lib/ui/MenuOption'
import MenuDivider from 'lib/ui/MenuDivider'
import DeleteIcon from 'assets/images/ui/icons/trash.svg'
import EditIcon from 'assets/images/ui/icons/edit.svg'
import DuplicateIcon from 'assets/images/ui/icons/duplicate.svg'
import DownloadIcon from 'assets/images/ui/icons/download.svg'

export type FormItemProps = {
  isHeader?: boolean
  form?: Form
}

export default function FormItem(props: FormItemProps) {
  const {isHeader, form} = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  if (isHeader || !form) {
    return (
      <Container>
        <HeaderLabel>Name</HeaderLabel>
      </Container>
    )
  }

  return (
    <Container>
      <Label>{form.name}</Label>
      <IconButton onClick={handleMenu}>
        <Icon className="fas fa-ellipsis-h" color="black" iconSize={18} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuOption icon={DeleteIcon} name="Delete" />
        <MenuDivider />
        <MenuOption icon={EditIcon} name="Edit Name" />
        <MenuDivider />
        <MenuOption icon={DuplicateIcon} name="Duplicate" />
        <MenuDivider />
        <MenuOption icon={DownloadIcon} name="Download Submissions" />
      </Menu>
    </Container>
  )
}

const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) =>
    `${props.theme.spacing[4]} ${props.theme.spacing[3]}`} !important;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray300} !important;
`

const HeaderLabel = styled(Label)`
  font-weight: 500 !important;
  font-size: 16px !important;
  line-height: 19px !important;
`
