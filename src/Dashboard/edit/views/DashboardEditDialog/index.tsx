import Dialog from '@material-ui/core/Dialog'
import styled from 'styled-components'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {setComponent} from 'Dashboard/edit/state/actions'
import {ComponentConfig} from 'Dashboard/edit/views/DashboardEditDialog/ComponentConfig'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from 'lib/ui/IconButton'
import grey from '@material-ui/core/colors/grey'

export default function DashboardEditDialog() {
  const component = useSelector(
    (state: RootState) => state.dashboardEditor.component,
  )

  const dispatch = useDispatch()

  const dialogVisible = Boolean(component)

  const stopEdit = () => {
    dispatch(setComponent(null))
  }

  return (
    <Dialog open={dialogVisible} onClose={stopEdit}>
      <CloseButton onClick={stopEdit} aria-label="close config dialog">
        <CloseIcon />
      </CloseButton>
      <DialogTitle>Configure</DialogTitle>
      <DialogContent>
        <ComponentConfig component={component} />
      </DialogContent>
    </Dialog>
  )
}

const CloseButton = styled(IconButton)`
  position: absolute;
  top: ${(props) => props.theme.spacing[1]};
  right: ${(props) => props.theme.spacing[1]};

  svg {
    color: ${grey[500]};
  }
`
